import { composeSiteSnapshotFromTables, readDraftSnapshot, readPublishedSnapshot } from '../_lib/content';
import { getDatabase } from '../_lib/database';
import { jsonResponse, unauthorized } from '../_lib/http';
import { getCsrfTokenFromRequest, requireAdminSession } from '../_lib/session';

function createEmptyResources() {
  return {
    homepage_content: [],
    hero_sections: [],
    services: [],
    portfolio_projects: [],
    testimonials: [],
    team_members: [],
    media_assets: [],
    seo_settings: [],
    contact_details: [],
    footer_content: [],
    activity_logs: [],
    drafts: [],
    published_content: [],
    roles: [],
    admin_users: []
  };
}

async function fetchTable(name: string) {
  const database = getDatabase();

  if (!database) {
    return [];
  }

  switch (name) {
    case 'homepage_content':
      return (await database`select * from homepage_content order by updated_at desc`) as any[];
    case 'hero_sections':
      return (await database`select * from hero_sections order by updated_at desc`) as any[];
    case 'services':
      return (await database`select * from services order by sort_order asc, updated_at desc`) as any[];
    case 'portfolio_projects':
      return (await database`select * from portfolio_projects order by sort_order asc, updated_at desc`) as any[];
    case 'testimonials':
      return (await database`select * from testimonials order by sort_order asc, updated_at desc`) as any[];
    case 'team_members':
      return (await database`select * from team_members order by sort_order asc, updated_at desc`) as any[];
    case 'media_assets':
      return (await database`select * from media_assets order by created_at desc`) as any[];
    case 'seo_settings':
      return (await database`select * from seo_settings order by updated_at desc`) as any[];
    case 'contact_details':
      return (await database`select * from contact_details order by updated_at desc`) as any[];
    case 'footer_content':
      return (await database`select * from footer_content order by updated_at desc`) as any[];
    case 'activity_logs':
      return (await database`select * from activity_logs order by created_at desc limit 100`) as any[];
    case 'drafts':
      return (await database`select * from drafts order by updated_at desc`) as any[];
    case 'published_content':
      return (await database`select * from published_content order by updated_at desc`) as any[];
    case 'roles':
      return (await database`select * from roles order by created_at asc`) as any[];
    case 'admin_users':
      return (await database`
        select u.id, u.email, u.display_name, u.avatar_url, u.status, u.last_login_at, u.created_at, u.updated_at, r.slug as role_slug, r.name as role_name
        from admin_users u
        inner join roles r on r.id = u.role_id
        order by u.created_at desc
      `) as any[];
    default:
      return [];
  }
}

export async function GET(request: Request) {
  const session = await requireAdminSession(request);

  if (!session) {
    return unauthorized();
  }

  try {
    const [published, draft, workingCopy, tables] = await Promise.all([
      readPublishedSnapshot(),
      readDraftSnapshot(),
      composeSiteSnapshotFromTables(),
      Promise.all([
        fetchTable('homepage_content'),
        fetchTable('hero_sections'),
        fetchTable('services'),
        fetchTable('portfolio_projects'),
        fetchTable('testimonials'),
        fetchTable('team_members'),
        fetchTable('media_assets'),
        fetchTable('seo_settings'),
        fetchTable('contact_details'),
        fetchTable('footer_content'),
        fetchTable('activity_logs'),
        fetchTable('drafts'),
        fetchTable('published_content'),
        fetchTable('roles'),
        fetchTable('admin_users')
      ])
    ]);

    return jsonResponse({
      published,
      draft,
      workingCopy,
      resources: {
        homepage_content: tables[0],
        hero_sections: tables[1],
        services: tables[2],
        portfolio_projects: tables[3],
        testimonials: tables[4],
        team_members: tables[5],
        media_assets: tables[6],
        seo_settings: tables[7],
        contact_details: tables[8],
        footer_content: tables[9],
        activity_logs: tables[10],
        drafts: tables[11],
        published_content: tables[12],
        roles: tables[13],
        admin_users: tables[14]
      },
      session: {
        user: session.user,
        expiresAt: session.expiresAt,
        csrfToken: session.directAccess ? session.csrfToken : getCsrfTokenFromRequest(request)
      }
    });
  } catch {
    return jsonResponse({
      published: await readPublishedSnapshot(),
      draft: await readDraftSnapshot(),
      workingCopy: await composeSiteSnapshotFromTables(),
      resources: createEmptyResources(),
      session: {
        user: session.user,
        expiresAt: session.expiresAt,
        csrfToken: session.directAccess ? session.csrfToken : getCsrfTokenFromRequest(request)
      }
    });
  }
}
