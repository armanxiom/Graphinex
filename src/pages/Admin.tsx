import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Database,
  Eye,
  FileText,
  Image,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Upload,
  Video,
  X,
  ChevronDown,
  ChevronUp,
  Copy
} from 'lucide-react';
import { announceContentRefresh } from '../state/site-content';
import { cloneSiteContent, defaultSiteContent, type SiteContent } from '../lib/siteContent';

type MediaKind = 'image' | 'video' | 'document' | 'logo';

type AdminSection = {
  key: string;
  group: string;
  title: string;
  summary: string;
  assets: AdminMedia[];
  editable: string[];
  data: unknown;
};

type AdminMedia = {
  id: string;
  name?: string;
  title?: string;
  altText?: string;
  kind?: MediaKind;
  category?: string;
  root?: string;
  sourcePath?: string;
  publicPath?: string;
  previewUrl?: string;
  path?: string;
  sizeBytes?: number;
  modifiedAt?: string;
  uploaded?: boolean;
  protected?: boolean;
  usedIn?: string[];
  filename?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  notes?: string;
  storageProvider?: string;
  status?: string;
};

type AdminActivity = {
  id: string;
  action: string;
  summary: string;
  createdAt: string;
  metadata?: unknown;
};

type AdminBootstrap = {
  content: SiteContent;
  updatedAt: string | null;
  version: string;
  sections: AdminSection[];
  media: AdminMedia[];
  activity: AdminActivity[];
  fileRoots: string[];
};

type UploadDraft = {
  file: File | null;
  title: string;
  altText: string;
  kind: MediaKind;
  category: string;
  notes: string;
};

type ReplaceDraft = {
  file: File | null;
  publicPath: string;
  title: string;
  altText: string;
  category: string;
  notes: string;
};

type FilterValue = 'all' | 'image' | 'video' | 'document' | 'logo' | 'uploaded' | 'protected';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type RequestError = Error & {
  status?: number;
  payload?: unknown;
};

const SECTION_TABS = ['All', 'Homepage', 'Portfolio', 'Social Proof', 'Header / Footer', 'Settings'] as const;
const MEDIA_FILTERS: FilterValue[] = ['all', 'image', 'video', 'document', 'logo', 'uploaded', 'protected'];

function createRequestUrl(url: string) {
  const requestUrl = new URL(url, window.location.origin);

  if (requestUrl.pathname.startsWith('/api/') && !requestUrl.pathname.startsWith('/api/public/')) {
    const accessCode = new URLSearchParams(window.location.search).get('access');

    if (accessCode && !requestUrl.searchParams.has('access')) {
      requestUrl.searchParams.set('access', accessCode);
    }
  }

  return requestUrl;
}

async function requestJson<T>(url: string, init: RequestInit = {}) {
  const requestUrl = createRequestUrl(url);

  const headers = new Headers(init.headers ?? {});
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(requestUrl.toString(), {
    ...init,
    headers,
    credentials: 'include'
  });

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
    const errorValue = payload && typeof payload === 'object' ? payload.message ?? payload.error ?? payload.details : payload;
    const message =
      typeof errorValue === 'string'
        ? errorValue
        : errorValue && typeof errorValue === 'object'
          ? JSON.stringify(errorValue)
          : `Request failed (${response.status})`;
    throw Object.assign(new Error(message), {
      status: response.status,
      payload
    }) as RequestError;
  }

  return payload as T;
}

function sendMultipart<T>(
  url: string,
  method: 'POST' | 'PUT',
  body: FormData,
  onProgress?: (progress: number) => void
) {
  return new Promise<T>((resolve, reject) => {
    const requestUrl = createRequestUrl(url);
    const xhr = new XMLHttpRequest();

    xhr.open(method, requestUrl.toString(), true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.min(100, Math.max(0, (event.loaded / event.total) * 100)));
      }
    };
    xhr.onload = () => {
      const text = xhr.responseText ?? '';
      let payload: any = null;

      if (text) {
        try {
          payload = JSON.parse(text);
        } catch {
          payload = text;
        }
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        const errorValue = payload && typeof payload === 'object' ? payload.message ?? payload.error ?? payload.details : payload;
        const message =
          typeof errorValue === 'string'
            ? errorValue
            : errorValue && typeof errorValue === 'object'
              ? JSON.stringify(errorValue)
              : `Request failed (${xhr.status})`;
        reject(
          Object.assign(new Error(message), {
            status: xhr.status,
            payload
          }) as RequestError
        );
        return;
      }

      resolve(payload as T);
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(body);
  });
}

function formatDate(value?: string | null) {
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
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function titleCase(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function pathLabel(pathName: string) {
  return pathName.split('.').map(titleCase).join(' / ');
}

function getPathValue(source: any, pathName: string) {
  return pathName.split('.').reduce((current, segment) => current?.[segment], source);
}

function setPathValue(source: any, pathName: string, nextValue: unknown) {
  const next = structuredClone(source);
  const segments = pathName.split('.');
  let cursor: any = next;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    if (!cursor[segment] || typeof cursor[segment] !== 'object') {
      cursor[segment] = {};
    }
    cursor = cursor[segment];
  }

  cursor[segments[segments.length - 1]] = nextValue;
  return next;
}

function createBlankValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return [];
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nextValue]) => [
        key,
        key === 'id' ? createId() : createBlankValue(nextValue)
      ])
    );
  }

  if (typeof value === 'number') {
    return 0;
  }

  if (typeof value === 'boolean') {
    return false;
  }

  return '';
}

function getItemLabel(item: unknown, index: number) {
  if (!item || typeof item !== 'object') {
    return `Item ${index + 1}`;
  }

  const record = item as Record<string, unknown>;
  return String(
    record.title ??
      record.name ??
      record.label ??
      record.step ??
      record.heading ??
      record.category ??
      record.role ??
      record.id ??
      `Item ${index + 1}`
  );
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `item-${Math.random().toString(36).slice(2, 10)}`;
}

function isLongText(label: string, value: unknown) {
  if (typeof value !== 'string') {
    return false;
  }

  return value.length > 120 || /(description|review|quote|bio|caption|summary|message|robots|html)/i.test(label);
}

function assetKind(asset: AdminMedia) {
  if (asset.kind) {
    return asset.kind;
  }

  if (asset.mimeType?.startsWith('video/')) {
    return 'video';
  }

  if (asset.mimeType?.startsWith('image/')) {
    return 'image';
  }

  if (asset.mimeType?.includes('pdf')) {
    return 'document';
  }

  return 'image';
}

function assetPreviewUrl(asset: AdminMedia) {
  return asset.previewUrl ?? asset.publicPath ?? asset.path ?? '';
}

function matchesSearch(text: string, search: string) {
  if (!search.trim()) {
    return true;
  }

  return text.toLowerCase().includes(search.trim().toLowerCase());
}

function sectionPreviewSummary(section: AdminSection) {
  return [
    section.title,
    section.group,
    section.summary,
    section.key,
    ...(section.editable ?? []),
    ...(section.assets ?? []).map((asset) => asset.publicPath ?? asset.path ?? asset.title ?? '')
  ]
    .filter(Boolean)
    .join(' ');
}

function mediaPreviewSummary(media: AdminMedia) {
  return [
    media.title,
    media.name,
    media.category,
    media.kind,
    media.publicPath,
    media.path,
    media.filename,
    media.notes,
    ...(media.usedIn ?? [])
  ]
    .filter(Boolean)
    .join(' ');
}

function previewGroup(asset: AdminMedia) {
  const kind = assetKind(asset);

  if (kind === 'video') {
    return 'Video';
  }

  if (kind === 'document') {
    return 'Document';
  }

  return 'Image';
}

function IconForKind({ kind, className }: { kind: string; className?: string }) {
  if (kind === 'video') {
    return <Video className={className} />;
  }

  if (kind === 'document') {
    return <FileText className={className} />;
  }

  return <Image className={className} />;
}

function previewNode(asset: AdminMedia, className = 'h-full w-full object-cover') {
  const url = assetPreviewUrl(asset);
  const kind = assetKind(asset);

  if (!url) {
    return (
      <div className="grid h-full w-full place-items-center bg-black/30 text-xs uppercase tracking-[0.22em] text-white/40">
        No preview
      </div>
    );
  }

  if (kind === 'video') {
    return <video src={url} controls muted playsInline className={className} />;
  }

  if (kind === 'document') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-black/35 p-4 text-center">
        <FileText className="h-9 w-9 text-white/70" />
        <div className="text-xs uppercase tracking-[0.2em] text-white/44">PDF / Document</div>
      </div>
    );
  }

  return <img src={url} alt={asset.altText ?? asset.title ?? asset.name ?? 'Media asset'} className={className} />;
}

function downloadLabel(asset: AdminMedia) {
  return asset.title ?? asset.name ?? asset.filename ?? 'Untitled asset';
}

function valueToDisplay(value: unknown) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return JSON.stringify(value, null, 2);
}

function getRequestStatus(error: unknown) {
  if (!error || typeof error !== 'object') {
    return null;
  }

  const record = error as RequestError;
  return typeof record.status === 'number' ? record.status : null;
}

function sectionAssetSummary(section: AdminSection) {
  return section.assets.slice(0, 3);
}

function AdminBadge({
  children,
  tone = 'default'
}: {
  children: ReactNode;
  tone?: 'default' | 'success' | 'danger' | 'muted';
}) {
  const toneClasses: Record<typeof tone, string> = {
    default: 'border-white/10 bg-white/5 text-white/72',
    success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
    danger: 'border-red-400/20 bg-red-500/10 text-red-100',
    muted: 'border-white/8 bg-black/20 text-white/52'
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

function SectionCard({
  section,
  active,
  onSelect
}: {
  section: AdminSection;
  active: boolean;
  onSelect: () => void;
}) {
  const previewAssets = sectionAssetSummary(section);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group overflow-hidden rounded-[1.6rem] border p-4 text-left transition-all duration-200 ${
        active
          ? 'border-brand-orange/45 bg-brand-orange/10 shadow-[0_18px_60px_rgba(255,122,0,0.16)]'
          : 'border-white/10 bg-white/[0.035] hover:border-white/16 hover:bg-white/[0.05]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/38">{section.group}</div>
          <div className="mt-2 text-lg font-semibold text-white">{section.title}</div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/58">{section.summary}</p>
        </div>

        <AdminBadge tone={active ? 'success' : 'muted'}>{section.assets.length} assets</AdminBadge>
      </div>

      <div className="mt-4 flex min-h-[4.8rem] gap-2 overflow-hidden">
        {previewAssets.length > 0 ? (
          previewAssets.map((asset) => {
            const kind = assetKind(asset);
            const url = assetPreviewUrl(asset);

            return (
              <div
                key={`${section.key}-${asset.id}`}
                className="relative flex-1 overflow-hidden rounded-[1.05rem] border border-white/10 bg-black/25"
              >
                {kind === 'video' ? (
                  <video src={url} muted playsInline className="h-full w-full object-cover" />
                ) : kind === 'document' ? (
                  <div className="grid h-full place-items-center">
                    <FileText className="h-6 w-6 text-white/65" />
                  </div>
                ) : (
                  <img src={url} alt={asset.title ?? asset.name ?? 'Section asset'} className="h-full w-full object-cover" />
                )}
              </div>
            );
          })
        ) : (
          <div className="grid h-full min-h-[4.6rem] flex-1 place-items-center rounded-[1.05rem] border border-dashed border-white/10 bg-black/20 text-[10px] uppercase tracking-[0.28em] text-white/38">
            No direct asset
          </div>
        )}
      </div>
    </button>
  );
}

function ValueEditor({
  label,
  value,
  onChange
}: {
  label: string;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (Array.isArray(value)) {
    return <CollectionEditor label={label} value={value} onChange={onChange} />;
  }

  if (value && typeof value === 'object') {
    return <ObjectEditor label={label} value={value as Record<string, unknown>} onChange={onChange} />;
  }

  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/72">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-transparent text-brand-orange"
        />
        {label}
      </label>
    );
  }

  if (typeof value === 'number') {
    return (
      <label className="block">
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-white/44">{titleCase(label)}</span>
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-brand-orange/45"
        />
      </label>
    );
  }

  const nextValue = valueToDisplay(value);
  const multiline = isLongText(label, nextValue);

  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-white/44">{titleCase(label)}</span>
      {multiline ? (
        <textarea
          value={nextValue}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[8rem] w-full rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-brand-orange/45"
        />
      ) : (
        <input
          value={nextValue}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-brand-orange/45"
        />
      )}
    </label>
  );
}

function ObjectEditor({
  label,
  value,
  onChange
}: {
  label: string;
  value: Record<string, unknown>;
  onChange: (value: unknown) => void;
}) {
  const entries = Object.entries(value ?? {});

  return (
    <div className="space-y-4 rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/38">{titleCase(label)}</div>
          <div className="mt-1 text-sm text-white/52">{entries.length} fields</div>
        </div>
      </div>

      <div className="grid gap-4">
        {entries.map(([field, fieldValue]) => (
          <div key={field}>
            <ValueEditor
              label={field}
              value={fieldValue}
              onChange={(nextValue) => onChange({ ...value, [field]: nextValue })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function CollectionEditor({
  label,
  value,
  onChange
}: {
  label: string;
  value: unknown[];
  onChange: (value: unknown) => void;
}) {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(() => {
    const first = value[0];
    return first && typeof first === 'object' ? [String((first as Record<string, unknown>).id ?? 0)] : ['0'];
  });

  useEffect(() => {
    const first = value[0];
    const firstKey = first && typeof first === 'object' ? String((first as Record<string, unknown>).id ?? 0) : '0';
    setExpandedKeys((current) => (current.length > 0 ? current : [firstKey]));
  }, [value]);

  function itemKey(item: unknown, index: number) {
    if (item && typeof item === 'object') {
      const record = item as Record<string, unknown>;
      return String(record.id ?? record.slug ?? record.name ?? record.title ?? index);
    }

    return String(index);
  }

  function toggleKey(key: string) {
    setExpandedKeys((current) =>
      current.includes(key) ? current.filter((entry) => entry !== key) : [...current, key]
    );
  }

  function updateItem(index: number, nextItem: unknown) {
    const next = structuredClone(value);
    next[index] = nextItem;
    onChange(next);
  }

  function moveItem(index: number, direction: -1 | 1) {
    const next = structuredClone(value);
    const target = index + direction;

    if (target < 0 || target >= next.length) {
      return;
    }

    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  }

  function duplicateItem(index: number) {
    const next = structuredClone(value);
    const current = next[index];
    const copy = current && typeof current === 'object' ? createBlankValue(current) : current;

    if (copy && typeof copy === 'object' && !Array.isArray(copy)) {
      const record = copy as Record<string, unknown>;
      record.id = createId();
      if (!record.title && !record.name && !record.label && !record.step) {
        record.title = `${label} ${next.length + 1}`;
      }
    }

    next.splice(index + 1, 0, copy);
    onChange(next);
  }

  function deleteItem(index: number) {
    const next = structuredClone(value);
    next.splice(index, 1);
    onChange(next);
  }

  function addItem() {
    const template = value[0];
    const next = structuredClone(value);
    next.push(template && typeof template === 'object' ? createBlankValue(template) : '');
    onChange(next);
  }

  return (
    <div className="space-y-4 rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/38">{titleCase(label)}</div>
          <div className="mt-1 text-sm text-white/52">{value.length} items</div>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-transform hover:translate-y-[-1px]"
        >
          <Plus size={14} />
          Add item
        </button>
      </div>

      <div className="grid gap-3">
        {value.length > 0 ? (
          value.map((item, index) => {
            const key = itemKey(item, index);
            const expanded = expandedKeys.includes(key);
            const labelText = getItemLabel(item, index);

            return (
              <div key={key} className="overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/20">
                <button
                  type="button"
                  onClick={() => toggleKey(key)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white">{labelText}</div>
                    <div className="mt-1 truncate text-[10px] uppercase tracking-[0.22em] text-white/38">
                      Item {index + 1}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        moveItem(index, -1);
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 hover:bg-white/10"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        moveItem(index, 1);
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 hover:bg-white/10"
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        duplicateItem(index);
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 hover:bg-white/10"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteItem(index);
                      }}
                      className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-100 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                    {expanded ? <ChevronUp size={14} className="text-white/70" /> : <ChevronDown size={14} className="text-white/70" />}
                  </div>
                </button>

                {expanded ? (
                  <div className="border-t border-white/10 p-4">
                    <ValueEditor
                      label={`${titleCase(label)} item ${index + 1}`}
                      value={item}
                      onChange={(nextValue) => updateItem(index, nextValue)}
                    />
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="rounded-[1.1rem] border border-dashed border-white/10 bg-black/20 p-5 text-sm text-white/52">
            This collection is empty.
          </div>
        )}
      </div>
    </div>
  );
}

function MediaCard({
  media,
  selected,
  onSelect,
  onReplace,
  onDelete,
  onCopyPath
}: {
  media: AdminMedia;
  selected: boolean;
  onSelect: () => void;
  onReplace: () => void;
  onDelete: () => void;
  onCopyPath: () => void;
}) {
  const kind = assetKind(media);
  const url = assetPreviewUrl(media);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group overflow-hidden rounded-[1.5rem] border text-left transition-all duration-200 ${
        selected
          ? 'border-brand-orange/40 bg-brand-orange/10 shadow-[0_18px_50px_rgba(255,122,0,0.16)]'
          : 'border-white/10 bg-white/[0.035] hover:border-white/16 hover:bg-white/[0.05]'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black/30">
        {kind === 'video' ? (
          <video src={url} controls muted playsInline className="h-full w-full object-cover" />
        ) : kind === 'document' ? (
          <div className="grid h-full place-items-center">
            <FileText className="h-10 w-10 text-white/72" />
          </div>
        ) : (
          <img src={url} alt={media.title ?? media.name ?? 'Media asset'} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <AdminBadge tone="muted">{previewGroup(media)}</AdminBadge>
          {media.protected ? <AdminBadge tone="danger">Protected</AdminBadge> : <AdminBadge tone="success">Editable</AdminBadge>}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <div className="truncate text-sm font-semibold text-white">{downloadLabel(media)}</div>
          <div className="mt-1 truncate text-[10px] uppercase tracking-[0.24em] text-white/38">
            {media.category ?? media.root ?? 'Asset'}
          </div>
        </div>

        <div className="text-xs text-white/54">
          <div className="truncate">{media.publicPath ?? media.path ?? 'No path'}</div>
          <div className="mt-1">{formatBytes(media.sizeBytes)}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onReplace();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/72 hover:bg-white/10"
          >
            <Pencil size={13} />
            Replace
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onCopyPath();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/72 hover:bg-white/10"
          >
            <Copy size={13} />
            Copy path
          </button>
          <button
            type="button"
            disabled={media.protected}
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-100 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    </button>
  );
}

function ReplaceModal({
  media,
  onClose,
  onSubmit,
  progress,
  busy
}: {
  media: AdminMedia | null;
  onClose: () => void;
  onSubmit: (draft: ReplaceDraft) => Promise<void>;
  progress: number;
  busy: boolean;
}) {
  const [draft, setDraft] = useState<ReplaceDraft>({
    file: null,
    publicPath: media?.publicPath ?? media?.path ?? '',
    title: media?.title ?? media?.name ?? '',
    altText: media?.altText ?? media?.title ?? media?.name ?? '',
    category: media?.category ?? '',
    notes: media?.notes ?? ''
  });

  useEffect(() => {
    setDraft({
      file: null,
      publicPath: media?.publicPath ?? media?.path ?? '',
      title: media?.title ?? media?.name ?? '',
      altText: media?.altText ?? media?.title ?? media?.name ?? '',
      category: media?.category ?? '',
      notes: media?.notes ?? ''
    });
  }, [media]);

  if (!media) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] grid place-items-center bg-black/76 px-4 py-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#070a10] shadow-[0_36px_110px_rgba(0,0,0,0.55)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
              Replace asset
            </div>
            <h3 className="mt-2 text-xl font-semibold text-white">{media.title ?? media.name ?? 'Media asset'}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
            aria-label="Close replace modal"
          >
            <X size={16} />
          </button>
        </div>

        <form
          className="grid gap-5 overflow-y-auto px-5 py-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit(draft);
          }}
        >
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/30">
              <div className="aspect-[4/3]">{previewNode(media)}</div>
              <div className="p-4 text-xs text-white/54">
                <div className="truncate">{media.publicPath ?? media.path ?? 'No path'}</div>
                <div className="mt-1">{media.protected ? 'Protected source asset' : 'Editable uploaded asset'}</div>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/44">
                Replacement file
              </span>
              <input
                type="file"
                accept="image/*,video/*,.pdf"
                onChange={(event) => setDraft((current) => ({ ...current, file: event.target.files?.[0] ?? null }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-brand-orange file:px-4 file:py-2 file:text-[10px] file:font-semibold file:uppercase file:tracking-[0.24em] file:text-white"
              />
            </label>

            {busy ? (
              <div className="rounded-[1.25rem] border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                  <span>Uploading</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-brand-orange transition-all duration-200" style={{ width: `${Math.max(4, progress)}%` }} />
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/44">
                  Title
                </span>
                <input
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-orange/45"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/44">
                  Alt text
                </span>
                <input
                  value={draft.altText}
                  onChange={(event) => setDraft((current) => ({ ...current, altText: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-orange/45"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/44">
                  Category
                </span>
                <input
                  value={draft.category}
                  onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-orange/45"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/44">
                  Target path
                </span>
                <input
                  value={draft.publicPath}
                  onChange={(event) => setDraft((current) => ({ ...current, publicPath: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-orange/45"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/44">
                Notes
              </span>
              <textarea
                value={draft.notes}
                onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
                className="min-h-[8rem] w-full rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-brand-orange/45"
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div className="text-xs text-white/48">
                The replacement file will be written locally and the public content snapshot will refresh after save.
              </div>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition-transform hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                Replace asset
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="grid min-h-[70vh] place-items-center rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center">
      <div>
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Loader2 className="h-6 w-6 animate-spin text-brand-orange" />
        </div>
        <div className="mt-4 text-lg font-semibold text-white">Loading control panel</div>
        <div className="mt-2 text-sm text-white/54">Reading the live site structure and local asset inventory.</div>
      </div>
    </div>
  );
}

function AccessDeniedState({
  onRetry
}: {
  onRetry: () => void;
}) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#05070b] px-4 text-center text-white">
      <div className="max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/25 text-2xl font-semibold text-white/82">
          404
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">The requested page could not be found</h1>
        <p className="mt-3 text-sm leading-7 text-white/58">
          The hidden control panel requires the secret access code in the URL. If you pasted the correct link, try reloading once.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white"
          >
            Return home
          </a>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/76 hover:bg-white/10"
          >
            Retry access check
          </button>
        </div>
      </div>
    </div>
  );
}

function AccessErrorState({
  error,
  onRetry
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#05070b] px-4 text-center text-white">
      <div className="max-w-lg rounded-[2rem] border border-red-500/20 bg-red-500/10 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-black/25 text-2xl font-semibold text-red-50">
          !
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Admin access check failed</h1>
        <p className="mt-3 text-sm leading-7 text-red-50/80">{error}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white"
          >
            Retry
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/76 hover:bg-white/10"
          >
            Return home
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorBanner({
  error,
  onRetry
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-[1.4rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>{error}</div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-black/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-50 hover:bg-black/30"
        >
          <RefreshCw size={13} />
          Retry
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const hasAccessQuery = new URLSearchParams(window.location.search).has('access');
  const [bootstrap, setBootstrap] = useState<AdminBootstrap | null>(null);
  const [contentDraft, setContentDraft] = useState<SiteContent>(() => cloneSiteContent(defaultSiteContent));
  const [selectedSectionKey, setSelectedSectionKey] = useState('');
  const [selectedMediaId, setSelectedMediaId] = useState('');
  const [structureGroup, setStructureGroup] = useState<(typeof SECTION_TABS)[number]>('All');
  const [mediaFilter, setMediaFilter] = useState<FilterValue>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [replaceProgress, setReplaceProgress] = useState(0);
  const [replaceTarget, setReplaceTarget] = useState<AdminMedia | null>(null);
  const [accessState, setAccessState] = useState<'checking' | 'allowed' | 'redirect-home' | 'not-found' | 'error'>(
    hasAccessQuery ? 'checking' : 'redirect-home'
  );
  const [uploadDraft, setUploadDraft] = useState<UploadDraft>({
    file: null,
    title: '',
    altText: '',
    kind: 'image',
    category: 'Website Assets',
    notes: ''
  });

  const contentRef = useRef(cloneSiteContent(defaultSiteContent));
  const bootstrapRef = useRef<AdminBootstrap | null>(null);
  const selectionRef = useRef({ sectionKey: '', mediaId: '' });
  const saveTimerRef = useRef<number | null>(null);
  const pendingSnapshotRef = useRef<SiteContent | null>(null);
  const savingRef = useRef(false);
  const skipAutosaveRef = useRef(true);

  const sections = bootstrap?.sections ?? [];
  const media = bootstrap?.media ?? [];
  const activity = bootstrap?.activity ?? [];
  const fileRoots = bootstrap?.fileRoots ?? [];

  const selectedSection = useMemo(
    () => sections.find((section) => section.key === selectedSectionKey) ?? sections[0] ?? null,
    [sections, selectedSectionKey]
  );

  const selectedMedia = useMemo(
    () => media.find((entry) => entry.id === selectedMediaId) ?? media[0] ?? null,
    [media, selectedMediaId]
  );

  const visibleSections = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sections.filter((section) => {
      const groupMatches = structureGroup === 'All' || section.group === structureGroup;
      if (!groupMatches) {
        return false;
      }

      if (!query) {
        return true;
      }

      return sectionPreviewSummary(section).toLowerCase().includes(query);
    });
  }, [search, sections, structureGroup]);

  const visibleMedia = useMemo(() => {
    const query = search.trim().toLowerCase();

    return media.filter((entry) => {
      const kind = assetKind(entry);

      if (mediaFilter !== 'all') {
        if (mediaFilter === 'uploaded' && !entry.uploaded) {
          return false;
        }

        if (mediaFilter === 'protected' && !entry.protected) {
          return false;
        }

        if (mediaFilter !== 'uploaded' && mediaFilter !== 'protected' && kind !== mediaFilter) {
          return false;
        }
      }

      if (!query) {
        return true;
      }

      return mediaPreviewSummary(entry).toLowerCase().includes(query);
    });
  }, [media, mediaFilter, search]);

  const groups = useMemo(() => {
    const next = ['All', ...new Set(sections.map((section) => section.group))];
    return next as (typeof SECTION_TABS)[number][];
  }, [sections]);

  const loadBootstrap = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await requestJson<AdminBootstrap>('/api/admin/content');
      bootstrapRef.current = payload;
      setBootstrap(payload);
      contentRef.current = cloneSiteContent(payload.content);
      setContentDraft(cloneSiteContent(payload.content));
      skipAutosaveRef.current = true;
      setDirty(false);
      setNotice(`Loaded local content snapshot ${payload.version.slice(0, 8)}`);

      const currentSelection = selectionRef.current;
      const nextSectionKey =
        payload.sections.some((section) => section.key === currentSelection.sectionKey)
          ? currentSelection.sectionKey
          : payload.sections[0]?.key ?? '';
      const nextMediaId =
        payload.media.some((entry) => entry.id === currentSelection.mediaId)
          ? currentSelection.mediaId
          : payload.media[0]?.id ?? '';

      if (nextSectionKey !== currentSelection.sectionKey) {
        setSelectedSectionKey(nextSectionKey);
      }

      if (nextMediaId !== currentSelection.mediaId) {
        setSelectedMediaId(nextMediaId);
      }
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Failed to load admin data.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const validateAccess = useCallback(async () => {
    if (!hasAccessQuery) {
      setAccessState('redirect-home');
      return;
    }

    setAccessState('checking');

    try {
      await requestJson<{ ok: boolean }>('/api/admin/status');
      setAccessState('allowed');
    } catch (checkError) {
      const status = getRequestStatus(checkError);
      const message = checkError instanceof Error ? checkError.message : 'Unable to verify admin access.';

      if (status === 404 || status === 401 || status === 403) {
        setAccessState('not-found');
        setError(message);
        return;
      }

      setAccessState('error');
      setError(message);
    }
  }, [hasAccessQuery]);

  const persistContent = useCallback(
    async function saveSnapshot(snapshot: SiteContent): Promise<void> {
      if (savingRef.current) {
        pendingSnapshotRef.current = snapshot;
        return;
      }

      savingRef.current = true;
      setSaving(true);
      setError(null);

      try {
        const payload = await requestJson<{ ok: boolean; updatedAt: string; version: string; content: SiteContent }>(
          '/api/admin/content',
          {
            method: 'PUT',
            body: JSON.stringify({ content: snapshot })
          }
        );

        setDirty(false);
        setNotice(`Saved at ${formatDate(payload.updatedAt)}`);
        announceContentRefresh();
        await loadBootstrap();
      } catch (saveError) {
        const message = saveError instanceof Error ? saveError.message : 'Failed to save content.';
        setError(message);
      } finally {
        savingRef.current = false;
        setSaving(false);

        const queued = pendingSnapshotRef.current;
        pendingSnapshotRef.current = null;

        if (queued) {
          void saveSnapshot(queued);
        }
      }
    },
    [loadBootstrap]
  );

  useEffect(() => {
    void validateAccess();
  }, [validateAccess]);

  useEffect(() => {
    if (accessState !== 'allowed') {
      return;
    }

    void loadBootstrap();
  }, [accessState, loadBootstrap]);

  useEffect(() => {
    selectionRef.current = {
      sectionKey: selectedSectionKey,
      mediaId: selectedMediaId
    };
  }, [selectedMediaId, selectedSectionKey]);

  useEffect(() => {
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }

    if (!dirty || loading) {
      return;
    }

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      void persistContent(contentRef.current);
    }, 700);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [contentDraft, dirty, loading, persistContent]);

  function mutateContent(mutator: (draft: SiteContent) => SiteContent | void) {
    const next = cloneSiteContent(contentRef.current);
    const result = mutator(next);
    const snapshot = (result as SiteContent) ?? next;
    contentRef.current = snapshot;
    setContentDraft(snapshot);
    setDirty(true);
    setNotice(null);
  }

  function updatePath(pathName: string, nextValue: unknown) {
    mutateContent((draft) => setPathValue(draft, pathName, nextValue));
  }

  async function handleManualSave() {
    await persistContent(contentRef.current);
  }

  async function handleUpload() {
    if (!uploadDraft.file) {
      setError('Choose a file to upload first.');
      return;
    }

    const form = new FormData();
    form.append('file', uploadDraft.file);
    form.append('title', uploadDraft.title || uploadDraft.file.name);
    form.append('altText', uploadDraft.altText || uploadDraft.title || uploadDraft.file.name);
    form.append('kind', uploadDraft.kind);
    form.append('collectionKey', uploadDraft.category);
    form.append('notes', uploadDraft.notes);

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      await sendMultipart<{ ok: boolean; item: AdminMedia }>('/api/media', 'POST', form, setUploadProgress);
      setUploadDraft({
        file: null,
        title: '',
        altText: '',
        kind: 'image',
        category: 'Website Assets',
        notes: ''
      });
      setNotice('Uploaded local file into the media library.');
      announceContentRefresh();
      await loadBootstrap();
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : 'Upload failed.';
      setError(message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function handleReplace(nextDraft: ReplaceDraft) {
    if (!replaceTarget) {
      return;
    }

    const form = new FormData();
    if (nextDraft.file) {
      form.append('file', nextDraft.file);
    }
    form.append('title', nextDraft.title);
    form.append('altText', nextDraft.altText);
    form.append('category', nextDraft.category);
    form.append('notes', nextDraft.notes);
    form.append('publicPath', nextDraft.publicPath);
    form.append('replaceTarget', nextDraft.publicPath);
    form.append('kind', assetKind(replaceTarget));

    setUploading(true);
    setReplaceProgress(0);
    setError(null);

    try {
      await sendMultipart<{ ok: boolean; item: AdminMedia }>(
        `/api/media/${encodeURIComponent(replaceTarget.id)}`,
        'PUT',
        form,
        setReplaceProgress
      );

      setReplaceTarget(null);
      setNotice(`Replaced ${downloadLabel(replaceTarget)}.`);
      announceContentRefresh();
      await loadBootstrap();
    } catch (replaceError) {
      const message = replaceError instanceof Error ? replaceError.message : 'Replacement failed.';
      setError(message);
    } finally {
      setUploading(false);
      setReplaceProgress(0);
    }
  }

  async function handleDeleteMedia(entry: AdminMedia) {
    if (!window.confirm(`Delete ${downloadLabel(entry)}?`)) {
      return;
    }

    setError(null);

    try {
      await requestJson(`/api/media/${encodeURIComponent(entry.id)}`, {
        method: 'DELETE'
      });
      setNotice(`Deleted ${downloadLabel(entry)}.`);
      announceContentRefresh();
      await loadBootstrap();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : 'Delete failed.';
      setError(message);
    }
  }

  async function copyPath(pathValue?: string) {
    if (!pathValue) {
      return;
    }

    await navigator.clipboard.writeText(pathValue);
    setNotice(`Copied ${pathValue}`);
  }

  const selectedSectionAssets = selectedSection?.assets ?? [];
  const retryAccessCheck = () => {
    setError(null);
    void validateAccess();
  };

  if (accessState === 'redirect-home') {
    return <Navigate to="/" replace />;
  }

  if (accessState === 'checking' && !bootstrap) {
    return <LoadingState />;
  }

  if (accessState === 'not-found') {
    return <AccessDeniedState onRetry={retryAccessCheck} />;
  }

  if (accessState === 'error' && !bootstrap) {
    return <AccessErrorState error={error ?? 'Unable to validate hidden admin access.'} onRetry={retryAccessCheck} />;
  }

  return (
    <div className="min-h-screen bg-[#05070b] text-white">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,122,0,0.15),_transparent_24%),radial-gradient(circle_at_82%_16%,_rgba(255,255,255,0.08),_transparent_20%),linear-gradient(180deg,_#05070b_0%,_#080b12_100%)]" />
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-brand-orange/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1760px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <AdminBadge tone="success">Direct access</AdminBadge>
                <AdminBadge tone="muted">Hidden route /armanxion-core</AdminBadge>
                <AdminBadge tone="muted">Local file mode</AdminBadge>
              </div>

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.36em] text-white/40">
                  Graphinex control panel
                </div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Real website structure, assets, and content. No login. No demo data.
                </h1>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-white/60 sm:text-base">
                  This panel reads the live local site content, shows the actual section inventory, and writes edits back to the file-based snapshot and asset library.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[520px]">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">Last sync</div>
                <div className="mt-2 text-lg font-semibold text-white">{formatDate(bootstrap?.updatedAt ?? null)}</div>
                <div className="mt-1 text-xs text-white/48">Version {bootstrap?.version?.slice(0, 12) ?? 'loading'}</div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">Controls</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void loadBootstrap()}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/76 hover:bg-white/10"
                  >
                    <RefreshCw size={14} />
                    Reload
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleManualSave()}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white hover:translate-y-[-1px]"
                  >
                    <Save size={14} />
                    Save now
                  </button>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/76 hover:bg-white/10"
                  >
                    <ArrowLeft size={14} />
                    Public site
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-5 space-y-4">
          {error ? <ErrorBanner error={error} onRetry={() => void loadBootstrap()} /> : null}
          {notice ? (
            <div className="rounded-[1.4rem] border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-50">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>{notice}</div>
                <button
                  type="button"
                  onClick={() => setNotice(null)}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-black/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-50 hover:bg-black/30"
                >
                  <X size={13} />
                  Dismiss
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {loading && !bootstrap ? (
          <div className="mt-5">
            <LoadingState />
          </div>
        ) : null}

        {bootstrap ? (
          <>
            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Sections', value: sections.length },
                { label: 'Media', value: media.length },
                { label: 'Uploads', value: media.filter((entry) => entry.uploaded).length },
                { label: 'Protected', value: media.filter((entry) => entry.protected).length }
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/38">{item.label}</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </section>

            <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/38">
                    Website structure viewer
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Real sections from the live Graphinex site</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
                    Select a section card to inspect the actual content and assets, then edit the underlying local snapshot directly.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[560px]">
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
                      Search
                    </span>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <Search size={15} className="text-white/40" />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Find sections, assets, or copy"
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
                      Section group
                    </span>
                    <select
                      value={structureGroup}
                      onChange={(event) => setStructureGroup(event.target.value as (typeof SECTION_TABS)[number])}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    >
                      {groups.map((groupName) => (
                        <option key={groupName} value={groupName} className="bg-[#0d1118]">
                          {groupName}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {visibleSections.map((section) => (
                  <div key={section.key}>
                    <SectionCard
                      section={section}
                      active={section.key === selectedSection?.key}
                      onSelect={() => setSelectedSectionKey(section.key)}
                    />
                  </div>
                ))}

                {visibleSections.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-black/20 p-6 text-sm text-white/52">
                    No sections match the current filters.
                  </div>
                ) : null}
              </div>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-5">
                {selectedSection ? (
                  <>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/38">
                          Selected section
                        </div>
                        <h3 className="mt-2 text-2xl font-semibold text-white">{selectedSection.title}</h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-white/58">{selectedSection.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <AdminBadge tone="success">{selectedSection.group}</AdminBadge>
                          <AdminBadge tone="muted">{selectedSection.key}</AdminBadge>
                          <AdminBadge tone="muted">{selectedSection.editable.length} editable paths</AdminBadge>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSectionKey(selectedSection.key);
                            void handleManualSave();
                          }}
                          className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white hover:translate-y-[-1px]"
                        >
                          <Save size={14} />
                          Save section
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                      <div className="space-y-4">
                        <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/38">
                            Asset preview
                          </div>
                          <div className="mt-4 grid gap-3">
                            {selectedSectionAssets.length > 0 ? (
                              selectedSectionAssets.map((asset) => {
                                const kind = assetKind(asset);
                                const url = assetPreviewUrl(asset);

                                return (
                                  <div
                                    key={`${selectedSection.key}-${asset.id}`}
                                    className="overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/30"
                                  >
                                    <div className="aspect-[16/9]">{previewNode(asset)}</div>
                                    <div className="flex items-center justify-between gap-4 px-4 py-3 text-xs text-white/55">
                                      <div className="min-w-0">
                                        <div className="truncate font-semibold text-white">{downloadLabel(asset)}</div>
                                        <div className="mt-1 truncate">{asset.publicPath ?? asset.path ?? 'No path'}</div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={async () => copyPath(asset.publicPath ?? asset.path ?? '')}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/72 hover:bg-white/10"
                                      >
                                        <Copy size={13} />
                                        Copy
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-black/20 p-5 text-sm text-white/52">
                                No direct asset attached to this section.
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/38">
                            Section notes
                          </div>
                          <div className="mt-3 space-y-2 text-sm leading-6 text-white/58">
                            <div>Path: <span className="text-white">{selectedSection.key}</span></div>
                            <div>Group: <span className="text-white">{selectedSection.group}</span></div>
                            <div>Assets: <span className="text-white">{selectedSection.assets.length}</span></div>
                            <div>Edit paths: <span className="text-white">{selectedSection.editable.join(', ') || 'None'}</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {selectedSection.editable.length > 0 ? (
                          selectedSection.editable.map((pathName) => {
                            const pathValue = getPathValue(contentDraft, pathName);

                            return (
                              <div key={pathName} className="space-y-3 rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                                <div className="flex items-center justify-between gap-4">
                                  <div>
                                    <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/38">
                                      {pathLabel(pathName)}
                                    </div>
                                    <div className="mt-1 text-sm text-white/54">
                                      {Array.isArray(pathValue)
                                        ? `${pathValue.length} items`
                                        : pathValue && typeof pathValue === 'object'
                                          ? `${Object.keys(pathValue as Record<string, unknown>).length} fields`
                                          : 'Primitive value'}
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => void handleManualSave()}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/72 hover:bg-white/10"
                                  >
                                    <Save size={13} />
                                    Save now
                                  </button>
                                </div>

                                <ValueEditor
                                  label={pathName}
                                  value={pathValue}
                                  onChange={(nextValue) => updatePath(pathName, nextValue)}
                                />
                              </div>
                            );
                          })
                        ) : (
                          <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-black/20 p-5 text-sm text-white/52">
                            This section does not expose editable fields.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-black/20 p-6 text-sm text-white/52">
                    No section selected.
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/38">
                        Media manager
                      </div>
                      <h3 className="mt-2 text-xl font-semibold text-white">Real files in public/assets and uploads</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <AdminBadge tone="muted">{visibleMedia.length} shown</AdminBadge>
                    </div>
                  </div>

                  <form
                    className="mt-5 grid gap-4 rounded-[1.4rem] border border-white/10 bg-black/20 p-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void handleUpload();
                    }}
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
                          File
                        </span>
                        <input
                          type="file"
                          accept="image/*,video/*,.pdf"
                          onChange={(event) =>
                            setUploadDraft((current) => ({ ...current, file: event.target.files?.[0] ?? null }))
                          }
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-brand-orange file:px-4 file:py-2 file:text-[10px] file:font-semibold file:uppercase file:tracking-[0.24em] file:text-white"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
                          Kind
                        </span>
                        <select
                          value={uploadDraft.kind}
                          onChange={(event) =>
                            setUploadDraft((current) => ({ ...current, kind: event.target.value as MediaKind }))
                          }
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                        >
                          <option value="image">image</option>
                          <option value="video">video</option>
                          <option value="document">document</option>
                          <option value="logo">logo</option>
                        </select>
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
                          Title
                        </span>
                        <input
                          value={uploadDraft.title}
                          onChange={(event) => setUploadDraft((current) => ({ ...current, title: event.target.value }))}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
                          Alt text
                        </span>
                        <input
                          value={uploadDraft.altText}
                          onChange={(event) => setUploadDraft((current) => ({ ...current, altText: event.target.value }))}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
                          Category
                        </span>
                        <input
                          value={uploadDraft.category}
                          onChange={(event) => setUploadDraft((current) => ({ ...current, category: event.target.value }))}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
                          Notes
                        </span>
                        <input
                          value={uploadDraft.notes}
                          onChange={(event) => setUploadDraft((current) => ({ ...current, notes: event.target.value }))}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                        />
                      </label>
                    </div>

                    {uploading ? (
                      <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-white/44">
                          <span>Upload progress</span>
                          <span>{Math.round(uploadProgress)}%</span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-brand-orange transition-all duration-200" style={{ width: `${Math.max(4, uploadProgress)}%` }} />
                        </div>
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      disabled={uploading}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition-transform hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      Upload asset
                    </button>
                  </form>

                  <div className="mt-5 grid gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {MEDIA_FILTERS.map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setMediaFilter(filter)}
                          className={`rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                            mediaFilter === filter
                              ? 'border-brand-orange/35 bg-brand-orange/15 text-white'
                              : 'border-white/10 bg-white/[0.04] text-white/58 hover:bg-white/8'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {visibleMedia.map((entry) => (
                        <div key={entry.id}>
                          <MediaCard
                            media={entry}
                            selected={entry.id === selectedMedia?.id}
                            onSelect={() => setSelectedMediaId(entry.id)}
                            onReplace={() => setReplaceTarget(entry)}
                            onDelete={() => void handleDeleteMedia(entry)}
                            onCopyPath={() => void copyPath(entry.publicPath ?? entry.path ?? '')}
                          />
                        </div>
                      ))}
                      {visibleMedia.length === 0 ? (
                        <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-black/20 p-6 text-sm text-white/52">
                          No media items match the current filters.
                        </div>
                      ) : null}
                    </div>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/38">
                    Selected asset
                  </div>
                  {selectedMedia ? (
                    <div className="mt-4 space-y-4">
                      <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/30">
                        <div className="aspect-[4/3]">{previewNode(selectedMedia)}</div>
                      </div>

                      <div className="space-y-3 text-sm text-white/60">
                        <div className="text-xl font-semibold text-white">{downloadLabel(selectedMedia)}</div>
                        <div>Path: <span className="text-white">{selectedMedia.publicPath ?? selectedMedia.path ?? 'No path'}</span></div>
                        <div>Category: <span className="text-white">{selectedMedia.category ?? 'Uncategorized'}</span></div>
                        <div>Used in: <span className="text-white">{selectedMedia.usedIn?.join(', ') || 'Not mapped yet'}</span></div>
                        <div>Status: <span className="text-white">{selectedMedia.protected ? 'Protected source' : 'Editable upload'}</span></div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setReplaceTarget(selectedMedia)}
                          className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white"
                        >
                          <Pencil size={14} />
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => void copyPath(selectedMedia.publicPath ?? selectedMedia.path ?? '')}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/76 hover:bg-white/10"
                        >
                          <Copy size={14} />
                          Copy path
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-[1.35rem] border border-dashed border-white/10 bg-black/20 p-6 text-sm text-white/52">
                      No media selected.
                    </div>
                  )}
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/38">File roots</div>
                  <div className="mt-4 grid gap-2">
                    {fileRoots.map((root) => (
                      <div key={root} className="rounded-[1.1rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                        {root}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/38">Activity log</div>
                      <h3 className="mt-2 text-xl font-semibold text-white">Recent local changes</h3>
                    </div>
                    <AdminBadge tone="muted">{activity.length} entries</AdminBadge>
                  </div>

                  <div className="mt-4 space-y-3">
                    {activity.length > 0 ? (
                      activity.map((entry) => (
                        <div key={entry.id} className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="text-sm font-semibold text-white">{entry.summary}</div>
                              <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-white/38">
                                {entry.action}
                              </div>
                            </div>
                            <div className="text-xs text-white/38">{formatDate(entry.createdAt)}</div>
                          </div>
                          {entry.metadata ? (
                            <pre className="mt-3 max-h-44 overflow-auto rounded-[1rem] border border-white/10 bg-black/30 p-3 font-mono text-[11px] leading-5 text-white/62">
                              {JSON.stringify(entry.metadata, null, 2)}
                            </pre>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-black/20 p-5 text-sm text-white/52">
                        No activity logged yet.
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </section>
          </>
        ) : null}
      </div>

      <AnimatePresence>
        {replaceTarget ? (
          <ReplaceModal
            media={replaceTarget}
            onClose={() => setReplaceTarget(null)}
            onSubmit={handleReplace}
            progress={replaceProgress}
            busy={uploading}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
