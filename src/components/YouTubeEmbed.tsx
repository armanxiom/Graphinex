import { useState } from 'react';

function getThumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function getEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`;
}

export function YouTubeEmbed({
  videoId,
  title,
  className = ''
}: {
  videoId: string;
  title: string;
  className?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = getThumbnailUrl(videoId);
  const embedUrl = getEmbedUrl(videoId);

  if (!isPlaying) {
    return (
      <button
        type="button"
        onClick={() => setIsPlaying(true)}
        aria-label={`Play ${title}`}
        className={`${className} relative overflow-hidden border-0 bg-black p-0 text-left outline-none`}
      >
        <img
          src={thumbnailUrl}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14),rgba(0,0,0,0.46))]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full border border-white/22 bg-white/12 text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-[10px]">
            <span className="ml-[5px] h-0 w-0 border-b-[12px] border-l-[19px] border-t-[12px] border-b-transparent border-l-brand-orange border-t-transparent" />
          </span>
        </div>
        <span className="absolute bottom-5 left-[22px] text-[11px] font-bold uppercase tracking-[0.24em] text-white/86">
          Play Showreel
        </span>
      </button>
    );
  }

  return (
    <iframe
      src={embedUrl}
      className={className}
      title={title}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
    />
  );
}
