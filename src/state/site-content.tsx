import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  cloneSiteContent,
  defaultSiteContent,
  syncStaticSiteContent,
  type SiteContent,
  type SiteContentEnvelope
} from '../lib/siteContent';

interface SiteContentContextValue {
  content: SiteContent;
  version: string;
  isLoading: boolean;
  isPreview: boolean;
  refreshContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

const CHANNEL_NAME = 'graphinex-content-sync';
const PREVIEW_STORAGE_KEY = 'graphinex-preview-mode';

async function loadContent(isPreview: boolean, signal?: AbortSignal): Promise<SiteContentEnvelope> {
  const url = new URL('/api/public/content', window.location.origin);

  if (isPreview) {
    url.searchParams.set('preview', '1');
  }

  const response = await fetch(url, {
    cache: 'no-store',
    credentials: 'include',
    signal,
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to load site content (${response.status})`);
  }

  return (await response.json()) as SiteContentEnvelope;
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => cloneSiteContent(defaultSiteContent));
  const [version, setVersion] = useState('fallback');
  const [isLoading, setIsLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const versionRef = useRef(version);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryPreview = searchParams.get('preview') === '1';
    const storedPreview = window.localStorage.getItem(PREVIEW_STORAGE_KEY) === '1';
    const enabled = queryPreview || storedPreview;

    setIsPreview(enabled);

    if (queryPreview) {
      window.localStorage.setItem(PREVIEW_STORAGE_KEY, '1');
    }
  }, []);

  const refreshContent = useMemo(
    () => async () => {
      const controller = new AbortController();

      try {
        const payload = await loadContent(isPreview, controller.signal);
        syncStaticSiteContent(payload.content);

        if (payload.version !== versionRef.current) {
          setContent(cloneSiteContent(payload.content));
          setVersion(payload.version);
          versionRef.current = payload.version;
        }
      } catch {
        setContent((current) => current ?? cloneSiteContent(defaultSiteContent));
      } finally {
        setIsLoading(false);
      }

      return () => controller.abort();
    },
    [isPreview]
  );

  useEffect(() => {
    let disposed = false;
    let cleanup = () => undefined;

    const boot = async () => {
      if (disposed) {
        return;
      }

      cleanup = (await refreshContent()) as unknown as () => void;
    };

    void boot();

    const interval = window.setInterval(() => {
      void refreshContent();
    }, 30000);

    const handleBroadcast = (event: MessageEvent) => {
      if (event.data === 'graphinex-content-updated' || event.data === 'graphinex-content-preview') {
        void refreshContent();
      }
    };

    const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;

    channel?.addEventListener('message', handleBroadcast);
    window.addEventListener('graphinex-content-updated', refreshContent as EventListener);

    return () => {
      disposed = true;
      cleanup();
      window.clearInterval(interval);
      channel?.removeEventListener('message', handleBroadcast);
      channel?.close();
      window.removeEventListener('graphinex-content-updated', refreshContent as EventListener);
    };
  }, [refreshContent]);

  const value = useMemo<SiteContentContextValue>(
    () => ({
      content,
      version,
      isLoading,
      isPreview,
      refreshContent
    }),
    [content, isLoading, isPreview, refreshContent, version]
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);

  if (!context) {
    throw new Error('useSiteContent must be used within SiteContentProvider');
  }

  return context;
}

export function announceContentRefresh() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event('graphinex-content-updated'));

  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage('graphinex-content-updated');
    channel.close();
  }
}

export function enablePreviewMode() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(PREVIEW_STORAGE_KEY, '1');
  window.dispatchEvent(new Event('graphinex-content-updated'));
}

export function disablePreviewMode() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(PREVIEW_STORAGE_KEY);
  window.dispatchEvent(new Event('graphinex-content-updated'));
}
