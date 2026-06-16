import { cloneSiteContent, defaultSiteContent } from '../../src/lib/siteContent.ts';
import { jsonResponse } from '../../server/functions/http.ts';
import { loadSiteContent } from '../../server/utils/content.js';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const preview = url.searchParams.get('preview') === '1';

  try {
    const { content, updatedAt, version } = await loadSiteContent();

    return jsonResponse({
      content,
      updatedAt,
      version,
      source: 'file',
      preview
    });
  } catch {
    const content = cloneSiteContent(defaultSiteContent);

    return jsonResponse({
      content,
      updatedAt: new Date().toISOString(),
      version: 'fallback',
      source: 'fallback',
      preview
    });
  }
}
