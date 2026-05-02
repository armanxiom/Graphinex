const buildPreviewMarkup = (videoId: string, title: string) => `
<!doctype html>
<html>
  <head>
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        height: 100%;
        background: #000;
        overflow: hidden;
        font-family: Inter, Arial, sans-serif;
      }
      a {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        color: white;
        text-decoration: none;
        background:
          linear-gradient(180deg, rgba(0,0,0,.14), rgba(0,0,0,.46)),
          url('https://i.ytimg.com/vi/${videoId}/hqdefault.jpg') center / cover no-repeat;
      }
      .play {
        width: 88px;
        height: 88px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.22);
        background: rgba(255,255,255,.12);
        backdrop-filter: blur(10px);
        display: grid;
        place-items: center;
        box-shadow: 0 18px 50px rgba(0,0,0,.35);
      }
      .triangle {
        width: 0;
        height: 0;
        border-top: 12px solid transparent;
        border-bottom: 12px solid transparent;
        border-left: 19px solid #ff6a00;
        margin-left: 5px;
      }
      .label {
        position: absolute;
        left: 22px;
        bottom: 20px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: .24em;
        text-transform: uppercase;
        color: rgba(255,255,255,.86);
      }
    </style>
  </head>
  <body>
    <a href="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" aria-label="${title}">
      <span class="play"><span class="triangle"></span></span>
      <span class="label">Play Showreel</span>
    </a>
  </body>
</html>
`;

export function YouTubeEmbed({
  videoId,
  title,
  className = ''
}: {
  videoId: string;
  title: string;
  className?: string;
}) {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
      srcDoc={buildPreviewMarkup(videoId, title)}
      className={className}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
    />
  );
}
