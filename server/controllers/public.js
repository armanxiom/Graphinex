import { json } from '../utils/http.js';
import { loadSiteContent } from '../utils/content.js';

export async function getPublicContent(request, response) {
  const preview = new URL(request.originalUrl ?? request.url, 'http://127.0.0.1').searchParams.get('preview') === '1';
  const { content, updatedAt, version } = await loadSiteContent();

  return json(response, 200, {
    content,
    updatedAt,
    version,
    source: 'file',
    preview
  });
}
