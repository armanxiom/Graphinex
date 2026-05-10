import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  ArrowLeft,
  Database,
  Eye,
  FileText,
  Image,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  Upload,
  Video,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { upload } from '@vercel/blob/client';
import { announceContentRefresh, enablePreviewMode } from '../state/site-content';
import { type SiteContent } from '../lib/siteContent';

type AdminRole = {
  slug: string;
  name: string;
  permissions: Record<string, boolean>;
};

type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: AdminRole;
  status: string;
};

type AdminRow = Record<string, any> & {
  id?: string;
  slug?: string;
  resource_key?: string;
  payload?: Record<string, any>;
  status?: string;
  sort_order?: number;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
  filename?: string;
  kind?: string;
  public_url?: string;
  preview_url?: string;
  mime_type?: string;
  size_bytes?: number;
  storage_provider?: string;
  storage_path?: string;
  alt_text?: string;
  width?: number;
  height?: number;
  duration_seconds?: number;
  checksum?: string;
};

type AdminBootstrap = {
  published: SiteContent;
  draft: SiteContent;
  workingCopy: SiteContent;
  resources: Record<string, AdminRow[]>;
  session: {
    user: AdminUser;
    expiresAt: string;
    csrfToken: string;
  };
};

type EditorState = {
  resource: string;
  row: AdminRow | null;
  resourceKey: string;
  status: string;
  sortOrder: string;
  featured: boolean;
  payloadText: string;
};

type UploadState = {
  file: File | null;
  kind: 'image' | 'video' | 'logo' | 'document';
  title: string;
  altText: string;
  collectionKey: string;
  progress: number;
  busy: boolean;
  error: string | null;
  notice: string | null;
};

type TabKey = 'overview' | 'content' | 'media' | 'activity' | 'settings';

const CONTENT_RESOURCE_KEYS = [
  'homepage_content',
  'hero_sections',
  'services',
  'portfolio_projects',
  'testimonials',
  'team_members',
  'seo_settings',
  'contact_details',
  'footer_content'
] as const;

const SYSTEM_RESOURCE_KEYS = ['drafts', 'published_content', 'roles', 'admin_users'] as const;

const TAB_ITEMS: Array<{ key: TabKey; label: string; icon: typeof Database }> = [
  { key: 'overview', label: 'Overview', icon: Database },
  { key: 'content', label: 'Content', icon: FileText },
  { key: 'media', label: 'Media', icon: Image },
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'settings', label: 'Settings', icon: Settings }
];

const RESOURCE_LABELS: Record<string, string> = {
  homepage_content: 'Homepage Content',
  hero_sections: 'Hero Section',
  services: 'Services',
  portfolio_projects: 'Portfolio Projects',
  testimonials: 'Testimonials',
  team_members: 'Team Members',
  media_assets: 'Media Assets',
  seo_settings: 'SEO Settings',
  contact_details: 'Contact Details',
  footer_content: 'Footer Content',
  drafts: 'Draft Snapshots',
  published_content: 'Published Snapshots',
  roles: 'Roles',
  admin_users: 'Admin Users',
  activity_logs: 'Activity Logs'
};

const RESOURCE_DESCRIPTIONS: Record<string, string> = {
  homepage_content: 'Global brand, navigation, and homepage sections.',
  hero_sections: 'Hero copy and opening banner content.',
  services: 'Service rows powering the services block.',
  portfolio_projects: 'Portfolio items and featured work.',
  testimonials: 'Social proof and testimonial cards.',
  team_members: 'Team member cards and bios.',
  media_assets: 'Uploaded images, videos, logos, and assets.',
  seo_settings: 'Metadata for home and portfolio pages.',
  contact_details: 'Phone, email, and WhatsApp contact details.',
  footer_content: 'Footer copy and legal labels.',
  drafts: 'Current draft snapshots awaiting publish.',
  published_content: 'Live snapshots currently serving the public site.',
  roles: 'Role definitions and permissions.',
  admin_users: 'Admin accounts and access levels.',
  activity_logs: 'Recent admin actions and audit entries.'
};

function requestJson<T>(url: string, init: RequestInit = {}) {
  const requestUrl = new URL(url, window.location.origin);

  if (requestUrl.pathname.startsWith('/api/admin/')) {
    const accessCode = new URLSearchParams(window.location.search).get('access');

    if (accessCode && !requestUrl.searchParams.has('access')) {
      requestUrl.searchParams.set('access', accessCode);
    }
  }

  return fetch(requestUrl.toString(), {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...(init.headers ?? {})
    }
  }).then(async (response) => {
    const text = await response.text();
    let payload: any = null;

    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }

    if (!response.ok) {
      const errorValue = payload && typeof payload === 'object' ? payload.error ?? payload.details ?? payload.message : payload;
      const message =
        typeof errorValue === 'string'
          ? errorValue
          : errorValue && typeof errorValue === 'object'
            ? JSON.stringify(errorValue)
            : `Request failed (${response.status})`;
      throw new Error(message);
    }

    return payload as T;
  });
}

function friendlyResourceName(key: string) {
  return RESOURCE_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function resourceDescription(key: string) {
  return RESOURCE_DESCRIPTIONS[key] ?? 'Editable content resource.';
}

function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '{}';
  }
}

function summarizePayload(row: AdminRow) {
  const payload = row.payload && typeof row.payload === 'object' ? row.payload : {};
  return (
    row.filename ??
    payload.title ??
    payload.name ??
    payload.label ??
    payload.step ??
    payload.heading ??
    row.resource_key ??
    row.slug ??
    row.id ??
    'Untitled'
  );
}

function summarizeRow(row: AdminRow) {
  const payload = row.payload && typeof row.payload === 'object' ? row.payload : {};
  const primary = summarizePayload(row);
  const secondary = payload.description ?? payload.subtitle ?? payload.role ?? payload.category ?? '';

  return {
    primary: String(primary),
    secondary: String(secondary)
  };
}

function createEditorState(resource: string, row: AdminRow | null): EditorState {
  const payload = buildEditorPayload(resource, row);

  return {
    resource,
    row,
    resourceKey: String(row?.resource_key ?? row?.slug ?? row?.id ?? payload.title ?? payload.name ?? ''),
    status: String(row?.status ?? 'published'),
    sortOrder: String(row?.sort_order ?? 0),
    featured: Boolean(row?.featured),
    payloadText: safeStringify(payload)
  };
}

function buildEditorPayload(resource: string, row: AdminRow | null) {
  const payload = row?.payload && typeof row.payload === 'object' ? row.payload : {};

  if (resource !== 'media_assets' || !row) {
    return payload;
  }

  return {
    ...payload,
    filename: row.filename,
    kind: row.kind,
    mimeType: row.mime_type,
    storageProvider: row.storage_provider,
    storagePath: row.storage_path,
    publicUrl: row.public_url,
    previewUrl: row.preview_url,
    altText: row.alt_text,
    sizeBytes: row.size_bytes,
    width: row.width,
    height: row.height,
    durationSeconds: row.duration_seconds,
    checksum: row.checksum
  };
}

function formatDate(value?: string) {
  if (!value) {
    return 'Unknown';
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(parsed);
}

function formatBytes(size?: number) {
  if (!size || size <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function hasPermission(session: AdminBootstrap['session'] | null, permission: string) {
  const permissions = session?.user.role.permissions ?? {};
  return Boolean(permissions.all || permissions[permission] || session?.user.role.slug === 'superadmin');
}

function ResourceCard({
  resource,
  rows,
  searchTerm,
  canEdit,
  onCreate,
  onEdit,
  onDelete
}: {
  resource: string;
  rows: AdminRow[];
  searchTerm: string;
  canEdit: boolean;
  onCreate: () => void;
  onEdit: (row: AdminRow) => void;
  onDelete: (row: AdminRow) => void;
}) {
  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter((row) => {
      const haystack = `${summarizePayload(row)} ${row.resource_key ?? ''} ${row.slug ?? ''} ${safeStringify(row.payload ?? row)}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [rows, searchTerm]);

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-5">
      <div className="flex flex-col gap-4 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/42">
            {friendlyResourceName(resource)}
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            {resourceDescription(resource)}
          </p>
        </div>

        {canEdit ? (
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-transform duration-200 hover:translate-y-[-1px]"
          >
            <Plus size={14} />
            New
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3">
        {filteredRows.length > 0 ? (
          filteredRows.map((row) => {
            const { primary, secondary } = summarizeRow(row);
            const keyLabel = row.resource_key ?? row.slug ?? row.id ?? 'row';

            return (
              <div
                key={`${resource}-${row.id ?? keyLabel}`}
                className="rounded-[1.35rem] border border-white/8 bg-black/20 p-4 transition-colors hover:border-white/15"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-white">{primary}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/42">{keyLabel}</div>
                    {secondary ? <p className="mt-2 text-sm leading-6 text-white/64">{secondary}</p> : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/46">
                    <span className="rounded-full border border-white/10 px-3 py-1">{row.status ?? 'published'}</span>
                    <span className="rounded-full border border-white/10 px-3 py-1">Sort {row.sort_order ?? 0}</span>
                    <span className="rounded-full border border-white/10 px-3 py-1">
                      {row.featured ? 'Featured' : 'Standard'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {canEdit ? (
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                  ) : null}

                  {canEdit ? (
                    <button
                      type="button"
                      onClick={() => onDelete(row)}
                      className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-200 transition-colors hover:bg-red-500/20"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[1.35rem] border border-dashed border-white/10 bg-black/10 p-6 text-sm text-white/50">
            No rows match this filter.
          </div>
        )}
      </div>
    </section>
  );
}

function EditorModal({
  editor,
  saving,
  onClose,
  onChange,
  onSave
}: {
  editor: EditorState | null;
  saving: boolean;
  onClose: () => void;
  onChange: (next: EditorState) => void;
  onSave: () => void;
}) {
  if (!editor) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[220] grid place-items-center bg-black/75 px-4 py-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#070a10] shadow-[0_34px_110px_rgba(0,0,0,0.55)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/44">
              {friendlyResourceName(editor.resource)}
            </div>
            <h3 className="mt-2 text-xl font-semibold text-white">Edit record</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white transition-colors hover:bg-white/12"
            aria-label="Close editor"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-4 overflow-y-auto px-5 py-5 sm:px-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/46">
                Resource key
              </span>
              <input
                value={editor.resourceKey}
                onChange={(event) => onChange({ ...editor, resourceKey: event.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-white/28 focus:border-brand-orange/40"
                placeholder="slug-or-key"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/46">
                  Status
                </span>
                <select
                  value={editor.status}
                  onChange={(event) => onChange({ ...editor, status: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 focus:border-brand-orange/40"
                >
                  <option value="published">published</option>
                  <option value="draft">draft</option>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="archived">archived</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/46">
                  Sort order
                </span>
                <input
                  type="number"
                  value={editor.sortOrder}
                  onChange={(event) => onChange({ ...editor, sortOrder: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 focus:border-brand-orange/40"
                />
              </label>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
              <input
                type="checkbox"
                checked={editor.featured}
                onChange={(event) => onChange({ ...editor, featured: event.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-transparent text-brand-orange"
              />
              Featured
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/46">
              Payload JSON
            </span>
            <textarea
              value={editor.payloadText}
              onChange={(event) => onChange({ ...editor, payloadText: event.target.value })}
              className="min-h-[24rem] w-full rounded-[1.5rem] border border-white/10 bg-black/35 px-4 py-3 font-mono text-[13px] leading-6 text-white outline-none ring-0 placeholder:text-white/28 focus:border-brand-orange/40"
              spellCheck={false}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 sm:px-6">
          <p className="text-xs text-white/50">
            Changes are saved to the database and reflected live after publish or refresh.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-transform hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminPage() {
  const [bootstrap, setBootstrap] = useState<AdminBootstrap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [selectedResource, setSelectedResource] = useState<string>(CONTENT_RESOURCE_KEYS[0]);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [savingEditor, setSavingEditor] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    kind: 'image',
    title: '',
    altText: '',
    collectionKey: '',
    progress: 0,
    busy: false,
    error: null,
    notice: null
  });

  const csrfToken = bootstrap?.session.csrfToken ?? '';
  const session = bootstrap?.session ?? null;
  const canManageContent = hasPermission(session, 'manage_content');
  const canManageMedia = hasPermission(session, 'manage_media');
  const canManageAccount = hasPermission(session, 'manage_account');

  const resourceKeys = useMemo(() => {
    if (!bootstrap) {
      return [] as string[];
    }

    return [
      ...CONTENT_RESOURCE_KEYS,
      ...SYSTEM_RESOURCE_KEYS,
      'media_assets',
      'activity_logs'
    ].filter((key, index, array) => array.indexOf(key) === index && Boolean(bootstrap.resources[key]));
  }, [bootstrap]);

  const loadBootstrap = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await requestJson<AdminBootstrap>('/api/admin/content', {
        method: 'GET'
      });

      setBootstrap(payload);

      if (!CONTENT_RESOURCE_KEYS.includes(selectedResource as (typeof CONTENT_RESOURCE_KEYS)[number]) && payload.resources[selectedResource]) {
        setSelectedResource(selectedResource);
      }

      if (!payload.resources[selectedResource]) {
        const fallback = CONTENT_RESOURCE_KEYS.find((key) => payload.resources[key]) ?? Object.keys(payload.resources)[0];
        if (fallback) {
          setSelectedResource(fallback);
        }
      }
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Unable to load admin dashboard.';

      if (/401/i.test(message) || /unauthorized/i.test(message)) {
        setBootstrap(null);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!bootstrap) {
      return;
    }

    if (!bootstrap.resources[selectedResource]) {
      const fallback = CONTENT_RESOURCE_KEYS.find((key) => bootstrap.resources[key]) ?? Object.keys(bootstrap.resources)[0];
      if (fallback) {
        setSelectedResource(fallback);
      }
    }
  }, [bootstrap, selectedResource]);

  const logout = async () => {
    if (!csrfToken) {
      return;
    }

    try {
      await requestJson('/api/admin/auth/logout', {
        method: 'POST',
        headers: {
          'x-csrf-token': csrfToken
        }
      });
    } finally {
      setBootstrap(null);
      setActiveTab('overview');
      setSearchTerm('');
    }
  };

  const publish = async () => {
    if (!csrfToken) {
      return;
    }

    await requestJson('/api/admin/publish', {
      method: 'POST',
      headers: {
        'x-csrf-token': csrfToken
      }
    });

    announceContentRefresh();
    await loadBootstrap();
  };

  const openEditor = (resource: string, row: AdminRow | null = null) => {
    setEditor(createEditorState(resource, row));
  };

  const closeEditor = () => {
    setEditor(null);
    setSavingEditor(false);
  };

  const saveEditor = async () => {
    if (!editor || !csrfToken) {
      return;
    }

    let payload: Record<string, any>;

    try {
      payload = JSON.parse(editor.payloadText || '{}') as Record<string, any>;
    } catch {
      setError('Payload JSON is invalid.');
      return;
    }

    setSavingEditor(true);

    const body = {
      resourceKey: editor.resourceKey.trim() || undefined,
      payload,
      status: editor.status,
      sortOrder: Number.isFinite(Number(editor.sortOrder)) ? Number(editor.sortOrder) : 0,
      featured: editor.featured
    };

    try {
      const endpoint = editor.row?.id
        ? `/api/admin/records/${editor.resource}/${editor.row.id}`
        : `/api/admin/records/${editor.resource}`;

      await requestJson(endpoint, {
        method: editor.row?.id ? 'PATCH' : 'POST',
        headers: {
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify(body)
      });

      announceContentRefresh();
      await loadBootstrap();
      closeEditor();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save record');
      setSavingEditor(false);
    }
  };

  const deleteRow = async (resource: string, row: AdminRow) => {
    if (!csrfToken || !row.id) {
      return;
    }

    const confirmed = window.confirm(`Delete ${summarizePayload(row)}?`);
    if (!confirmed) {
      return;
    }

    await requestJson(`/api/admin/records/${resource}/${row.id}`, {
      method: 'DELETE',
      headers: {
        'x-csrf-token': csrfToken
      }
    });

    announceContentRefresh();
    await loadBootstrap();
  };

  const uploadMedia = async (event: FormEvent) => {
    event.preventDefault();

    if (!uploadState.file || !csrfToken) {
      return;
    }

    setUploadState((current) => ({
      ...current,
      busy: true,
      error: null,
      notice: null,
      progress: 0
    }));

    try {
      await upload(uploadState.file.name, uploadState.file, {
        access: 'public',
        handleUploadUrl: '/api/admin/media/upload',
        clientPayload: JSON.stringify({
          kind: uploadState.kind,
          title: uploadState.title,
          altText: uploadState.altText,
          collectionKey: uploadState.collectionKey
        }),
        headers: {
          'x-csrf-token': csrfToken
        },
        onUploadProgress(progressEvent) {
          setUploadState((current) => ({
            ...current,
            progress: progressEvent.percentage
          }));
        }
      });

      setUploadState({
        file: null,
        kind: 'image',
        title: '',
        altText: '',
        collectionKey: '',
        progress: 0,
        busy: false,
        error: null,
        notice: 'Upload completed successfully.'
      });

      announceContentRefresh();
      await loadBootstrap();
    } catch (uploadError) {
      setUploadState((current) => ({
        ...current,
        busy: false,
        error: uploadError instanceof Error ? uploadError.message : 'Upload failed'
      }));
    }
  };

  const openPreview = () => {
    enablePreviewMode();
    window.open('/?preview=1', '_blank', 'noopener,noreferrer');
  };

  const contentRows = bootstrap?.resources[selectedResource] ?? [];
  const activeRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return contentRows;
    }

    return contentRows.filter((row) => {
      const summary = `${summarizePayload(row)} ${row.resource_key ?? ''} ${row.slug ?? ''} ${safeStringify(row.payload ?? row)}`.toLowerCase();
      return summary.includes(query);
    });
  }, [contentRows, searchTerm]);

  const activityRows = bootstrap?.resources.activity_logs ?? [];
  const mediaRows = bootstrap?.resources.media_assets ?? [];
  const draftSnapshot = bootstrap?.draft;
  const publishedSnapshot = bootstrap?.published;
  const workingCopy = bootstrap?.workingCopy;

  const totalContentRows = useMemo(
    () =>
      Object.values((bootstrap?.resources ?? {}) as Record<string, AdminRow[]>).reduce(
        (count, rows) => count + rows.length,
        0
      ),
    [bootstrap]
  );

  if (loading && !bootstrap) {
    return (
      <div className="min-h-screen bg-[#05070b] text-white">
        <div className="grid min-h-screen place-items-center">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.28em] text-white/50">
            <Loader2 className="animate-spin" size={18} />
            Loading admin console
          </div>
        </div>
      </div>
    );
  }

  if (!bootstrap) {
    return (
      <div className="min-h-screen bg-[#05070b] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-brand-orange/15 blur-3xl" />
          <div className="absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/56 transition-colors hover:text-white"
              >
                <ArrowLeft size={14} />
                Back to website
              </Link>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-orange">
                <Shield size={12} />
                Hidden access only
              </div>

              <h1 className="mt-5 text-[clamp(2.4rem,5vw,4.8rem)] font-black uppercase leading-[0.94] tracking-[-0.05em] text-white">
                Graphinex Control Plane
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/66">
                Open the hidden URL with the access code and the dashboard will load directly. No login screen is used.
              </p>

              {error ? (
                <div className="mt-8 rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : (
                <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/62">
                  The hidden URL is valid. If the dashboard does not appear, refresh once or check the deployment logs.
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.04] to-brand-orange/10 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">Route</div>
                  <div className="mt-2 text-lg font-semibold text-white">/armanxion-core</div>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">Access</div>
                  <div className="mt-2 text-lg font-semibold text-white">Direct URL only</div>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">Data</div>
                  <div className="mt-2 text-lg font-semibold text-white">PostgreSQL + Blob storage</div>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">Updates</div>
                  <div className="mt-2 text-lg font-semibold text-white">Live refresh + publish flow</div>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                  What this console does
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-white/64">
                  <li>Edits homepage, hero, services, portfolio, testimonials, SEO, contact, and footer content.</li>
                  <li>Uploads and manages media assets with real Blob storage metadata.</li>
                  <li>Publishes draft snapshots and broadcasts live refreshes to the public site.</li>
                  <li>Opens directly from the hidden URL without a login form.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070b] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-brand-orange/12 blur-3xl" />
        <div className="absolute right-0 top-0 h-[34rem] w-[34rem] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] gap-5 px-3 py-3 sm:px-4 sm:py-4 lg:px-5">
        <aside className="hidden w-[18rem] shrink-0 flex-col rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl xl:flex">
          <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange text-white">
              <Shield size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">Control Plane</div>
              <div className="truncate text-lg font-semibold text-white">{session?.user.displayName}</div>
            </div>
          </div>

          <nav className="mt-4 space-y-2">
            {TAB_ITEMS.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                    activeTab === tab.key
                      ? 'border-brand-orange/30 bg-brand-orange/10 text-white'
                      : 'border-white/8 bg-black/10 text-white/68 hover:border-white/14 hover:bg-white/6'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">Session</div>
            <div className="mt-2 text-sm text-white/80">{session?.user.email}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/54">
                {session?.user.role.name}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/54">
                Expires {formatDate(session?.expiresAt)}
              </span>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange text-white">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                    Hidden admin
                  </div>
                  <h1 className="text-2xl font-semibold text-white">Graphinex Control Plane</h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={openPreview}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white/10"
                >
                  <Eye size={14} />
                  Preview
                </button>

                {canManageContent ? (
                  <button
                    type="button"
                    onClick={() => void publish()}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-transform hover:translate-y-[-1px]"
                  >
                    <Sparkles size={14} />
                    Publish
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => void loadBootstrap()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white/10"
                >
                  <RefreshCw size={14} />
                  Refresh
                </button>

                <button
                  type="button"
                  onClick={() => void logout()}
                  className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-200 transition-colors hover:bg-red-500/20"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">Content rows</div>
              <div className="mt-2 text-3xl font-semibold text-white">{totalContentRows}</div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">Media assets</div>
              <div className="mt-2 text-3xl font-semibold text-white">{mediaRows.length}</div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">Audit logs</div>
              <div className="mt-2 text-3xl font-semibold text-white">{activityRows.length}</div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">Status</div>
              <div className="mt-2 text-3xl font-semibold text-emerald-300">
                {session?.user.role.slug ?? 'viewer'}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 xl:hidden">
            {TAB_ITEMS.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                    activeTab === tab.key
                      ? 'border-brand-orange/30 bg-brand-orange/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/70'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]"
                >
                  <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                          Live operations
                        </div>
                        <h2 className="mt-2 text-2xl font-semibold text-white">One-click publishing and preview</h2>
                      </div>

                      <Sparkles size={24} className="text-brand-orange" />
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={openPreview}
                        className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4 text-left transition-colors hover:border-white/15 hover:bg-white/6"
                      >
                        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                          Preview mode
                        </div>
                        <div className="mt-2 text-lg font-semibold text-white">Open draft site in a new tab</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => void publish()}
                        className="rounded-[1.4rem] border border-brand-orange/20 bg-brand-orange/10 p-4 text-left transition-colors hover:bg-brand-orange/15"
                      >
                        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-orange">
                          Publish draft
                        </div>
                        <div className="mt-2 text-lg font-semibold text-white">Promote the current draft to live</div>
                      </button>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                          Working copy
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/62">
                          Live content is sourced from the draft snapshot and revalidated after each save.
                        </p>
                      </div>
                      <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                          Session expiry
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/62">{formatDate(session?.expiresAt)}</p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                      Content summary
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {CONTENT_RESOURCE_KEYS.map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setSelectedResource(key);
                            setActiveTab('content');
                          }}
                          className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4 text-left transition-colors hover:border-white/15 hover:bg-white/6"
                        >
                          <div className="text-sm font-semibold text-white">{friendlyResourceName(key)}</div>
                          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                            {(bootstrap.resources[key] ?? []).length} rows
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                </motion.div>
              ) : null}

              {activeTab === 'content' ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-5 lg:grid-cols-[18rem_1fr]"
                >
                  <aside className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                      Content resources
                    </div>
                    <div className="mt-4 space-y-2">
                      {CONTENT_RESOURCE_KEYS.map((key) => {
                        const active = selectedResource === key;
                        const rows = bootstrap.resources[key] ?? [];

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setSelectedResource(key);
                              setSearchTerm('');
                            }}
                            className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                              active
                                ? 'border-brand-orange/25 bg-brand-orange/10 text-white'
                                : 'border-white/8 bg-black/10 text-white/70 hover:border-white/14 hover:bg-white/6'
                            }`}
                          >
                            <span className="text-sm font-medium">{friendlyResourceName(key)}</span>
                            <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/54">
                              {rows.length}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </aside>

                  <div className="space-y-5">
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                            {friendlyResourceName(selectedResource)}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-white/60">
                            {resourceDescription(selectedResource)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <div className="relative">
                            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/34" />
                            <input
                              value={searchTerm}
                              onChange={(event) => setSearchTerm(event.target.value)}
                              placeholder="Search rows..."
                              className="w-full rounded-full border border-white/10 bg-black/20 py-2.5 pl-9 pr-4 text-sm text-white outline-none focus:border-brand-orange/40 sm:w-72"
                            />
                          </div>

                          {canManageContent ? (
                            <button
                              type="button"
                              onClick={() => openEditor(selectedResource)}
                              className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-transform hover:translate-y-[-1px]"
                            >
                              <Plus size={14} />
                              New row
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <ResourceCard
                      resource={selectedResource}
                      rows={activeRows}
                      searchTerm={searchTerm}
                      canEdit={canManageContent}
                      onCreate={() => openEditor(selectedResource)}
                      onEdit={(row) => openEditor(selectedResource, row)}
                      onDelete={(row) => void deleteRow(selectedResource, row)}
                    />

                    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">System records</div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {SYSTEM_RESOURCE_KEYS.map((key) => (
                          <div key={key} className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
                            <div className="text-sm font-semibold text-white">{friendlyResourceName(key)}</div>
                            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                              {(bootstrap.resources[key] ?? []).length} rows
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </motion.div>
              ) : null}

              {activeTab === 'media' ? (
                <motion.div
                  key="media"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]"
                >
                  <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                          Upload media
                        </div>
                        <h2 className="mt-2 text-2xl font-semibold text-white">Add images, videos, logos, and documents</h2>
                      </div>
                      <Upload size={22} className="text-brand-orange" />
                    </div>

                    <form className="mt-5 space-y-4" onSubmit={uploadMedia}>
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/46">
                          File
                        </span>
                        <input
                          type="file"
                          accept="image/*,video/*,application/pdf"
                          onChange={(event) =>
                            setUploadState((current) => ({
                              ...current,
                              file: event.target.files?.[0] ?? null
                            }))
                          }
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-brand-orange file:px-4 file:py-2 file:text-[11px] file:font-semibold file:uppercase file:tracking-[0.22em] file:text-white"
                          required
                        />
                      </label>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/46">
                            Title
                          </span>
                          <input
                            value={uploadState.title}
                            onChange={(event) => setUploadState((current) => ({ ...current, title: event.target.value }))}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-orange/40"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/46">
                            Kind
                          </span>
                          <select
                            value={uploadState.kind}
                            onChange={(event) =>
                              setUploadState((current) => ({
                                ...current,
                                kind: event.target.value as UploadState['kind']
                              }))
                            }
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-orange/40"
                          >
                            <option value="image">image</option>
                            <option value="video">video</option>
                            <option value="logo">logo</option>
                            <option value="document">document</option>
                          </select>
                        </label>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/46">
                            Alt text
                          </span>
                          <input
                            value={uploadState.altText}
                            onChange={(event) => setUploadState((current) => ({ ...current, altText: event.target.value }))}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-orange/40"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/46">
                            Collection key
                          </span>
                          <input
                            value={uploadState.collectionKey}
                            onChange={(event) =>
                              setUploadState((current) => ({ ...current, collectionKey: event.target.value }))
                            }
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-orange/40"
                            placeholder="video-editing"
                          />
                        </label>
                      </div>

                      {uploadState.error ? <div className="text-sm text-red-200">{uploadState.error}</div> : null}
                      {uploadState.notice ? <div className="text-sm text-emerald-200">{uploadState.notice}</div> : null}

                      {uploadState.busy ? (
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-white/46">
                            <span>Uploading</span>
                            <span>{Math.round(uploadState.progress)}%</span>
                          </div>
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-brand-orange transition-all duration-200"
                              style={{ width: `${Math.max(4, uploadState.progress)}%` }}
                            />
                          </div>
                        </div>
                      ) : null}

                      <button
                        type="submit"
                        disabled={!canManageMedia || uploadState.busy}
                        className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition-transform hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {uploadState.busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        Upload file
                      </button>
                    </form>
                  </section>

                  <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                      Media library
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {mediaRows.length > 0 ? (
                        mediaRows.map((row) => {
                          const isVideo = row.kind === 'video' || row.mime_type?.startsWith('video/');
                          const previewUrl = row.preview_url ?? row.public_url;

                          return (
                            <div
                              key={row.id ?? row.storage_path ?? row.public_url}
                              className="overflow-hidden rounded-[1.45rem] border border-white/10 bg-black/20"
                            >
                              <div className="aspect-[4/3] bg-black/40">
                                {isVideo ? (
                                  <video src={previewUrl} controls className="h-full w-full object-cover" />
                                ) : (
                                  <img src={previewUrl} alt={row.alt_text ?? row.filename ?? 'Media asset'} className="h-full w-full object-cover" />
                                )}
                              </div>

                              <div className="space-y-2 p-4">
                                <div className="text-sm font-semibold text-white">{row.filename ?? 'Unnamed asset'}</div>
                                <div className="text-xs uppercase tracking-[0.22em] text-white/42">{row.kind ?? 'asset'}</div>
                                <div className="text-xs text-white/52">{formatBytes(row.size_bytes)}</div>

                                <div className="flex flex-wrap gap-2 pt-2">
                                  <button
                                    type="button"
                                    onClick={() => openEditor('media_assets', row)}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
                                  >
                                    <Pencil size={13} />
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void deleteRow('media_assets', row)}
                                    className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-200 transition-colors hover:bg-red-500/20"
                                  >
                                    <Trash2 size={13} />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="rounded-[1.45rem] border border-dashed border-white/10 bg-black/10 p-6 text-sm text-white/50">
                          No media assets uploaded yet.
                        </div>
                      )}
                    </div>
                  </section>
                </motion.div>
              ) : null}

              {activeTab === 'activity' ? (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-5 xl:grid-cols-[1fr_0.72fr]"
                >
                  <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">Activity logs</div>
                    <div className="mt-4 space-y-3">
                      {activityRows.length > 0 ? (
                        activityRows.map((row) => (
                          <div key={row.id ?? `${row.action}-${row.created_at}`} className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="text-sm font-semibold text-white">{row.summary ?? 'Activity'}</div>
                                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/42">
                                  {row.action ?? 'action'} · {row.entity_type ?? 'entity'}
                                </div>
                              </div>
                              <div className="text-xs text-white/42">{formatDate(row.created_at)}</div>
                            </div>
                            {row.metadata ? (
                              <pre className="mt-3 overflow-auto rounded-2xl border border-white/10 bg-black/30 p-3 font-mono text-[12px] leading-5 text-white/70">
                                {safeStringify(row.metadata)}
                              </pre>
                            ) : null}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[1.35rem] border border-dashed border-white/10 bg-black/10 p-6 text-sm text-white/50">
                          No activity recorded yet.
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="space-y-5">
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                        Published snapshot
                      </div>
                      <pre className="mt-4 max-h-[24rem] overflow-auto rounded-[1.35rem] border border-white/10 bg-black/25 p-4 font-mono text-[12px] leading-6 text-white/70">
                        {safeStringify(publishedSnapshot)}
                      </pre>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                        Draft snapshot
                      </div>
                      <pre className="mt-4 max-h-[24rem] overflow-auto rounded-[1.35rem] border border-white/10 bg-black/25 p-4 font-mono text-[12px] leading-6 text-white/70">
                        {safeStringify(draftSnapshot)}
                      </pre>
                    </div>
                  </section>
                </motion.div>
              ) : null}

              {activeTab === 'settings' ? (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]"
                >
                  <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">Account</div>
                    <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                      <div className="text-lg font-semibold text-white">{session?.user.displayName}</div>
                      <div className="mt-1 text-sm text-white/60">{session?.user.email}</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/54">
                          {session?.user.role.name}
                        </span>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/54">
                          {session?.user.status}
                        </span>
                      </div>
                    </div>

                    {canManageAccount ? (
                      <form
                        className="mt-5 space-y-4"
                        onSubmit={async (event) => {
                          event.preventDefault();
                          if (!csrfToken) return;

                          const form = new FormData(event.currentTarget);
                          const currentPassword = String(form.get('currentPassword') ?? '');
                          const newPassword = String(form.get('newPassword') ?? '');
                          const confirmPassword = String(form.get('confirmPassword') ?? '');

                          if (newPassword !== confirmPassword) {
                            setError('New password and confirmation do not match.');
                            return;
                          }

                          await requestJson('/api/admin/auth/password', {
                            method: 'POST',
                            headers: {
                              'x-csrf-token': csrfToken
                            },
                            body: JSON.stringify({ currentPassword, newPassword })
                          });
                        }}
                      >
                        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                          Change password
                        </div>
                        <input
                          name="currentPassword"
                          type="password"
                          placeholder="Current password"
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-orange/40"
                          required
                        />
                        <input
                          name="newPassword"
                          type="password"
                          placeholder="New password"
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-orange/40"
                          required
                        />
                        <input
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-orange/40"
                          required
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-transform hover:translate-y-[-1px]"
                        >
                          <Save size={14} />
                          Update password
                        </button>
                      </form>
                    ) : (
                      <p className="mt-5 text-sm leading-6 text-white/58">
                        This account does not currently have account-management permissions.
                      </p>
                    )}
                  </section>

                  <section className="space-y-5">
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                        Session controls
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={openPreview}
                          className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4 text-left transition-colors hover:border-white/15 hover:bg-white/6"
                        >
                          <div className="text-sm font-semibold text-white">Preview mode</div>
                          <div className="mt-1 text-sm text-white/60">Open the public site with draft content enabled.</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => void logout()}
                          className="rounded-[1.35rem] border border-red-500/20 bg-red-500/10 p-4 text-left transition-colors hover:bg-red-500/20"
                        >
                          <div className="text-sm font-semibold text-red-200">Log out</div>
                          <div className="mt-1 text-sm text-red-100/70">Clear the admin session cookies.</div>
                        </button>
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                        Admin notes
                      </div>
                      <ul className="mt-4 space-y-3 text-sm leading-7 text-white/62">
                        <li>Direct access uses the hidden URL and the access code, then loads the dashboard immediately.</li>
                        <li>Writes and uploads are still protected by the server-side access gate and role checks.</li>
                        <li>Each save triggers a content refresh broadcast so the public site can update without redeploying.</li>
                      </ul>
                    </div>
                  </section>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {editor ? (
          <EditorModal
            editor={editor}
            saving={savingEditor}
            onClose={closeEditor}
            onChange={setEditor}
            onSave={() => void saveEditor()}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
