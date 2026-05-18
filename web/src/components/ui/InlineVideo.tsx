"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Click-to-play looped video card. Respects the brief's "no autoplay video" rule.
 * Renders the poster + a play button by default; muted loop starts on user click.
 */
export function InlineVideo({
  src,
  poster,
  className,
  aspect = "video",
}: {
  src: string;
  poster: string;
  className?: string;
  aspect?: "video" | "portrait" | "square" | "wide";
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  const aspectClass = {
    video: "aspect-video",
    portrait: "aspect-[9/16]",
    square: "aspect-square",
    wide: "aspect-[21/9]",
  }[aspect];

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play()
        .then(() => {
          setStarted(true);
          setPlaying(true);
        })
        .catch(() => {});
    }
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden bg-bg-elevated rounded-sm",
        aspectClass,
        className,
      )}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Пауза" : "Воспроизвести"}
        className="absolute inset-0 flex items-center justify-center bg-bg/0 hover:bg-bg/15 transition-colors"
      >
        <span
          className={cn(
            "flex items-center justify-center size-14 rounded-full bg-bg/80 backdrop-blur-sm border border-text/15 text-text transition-opacity",
            playing && started ? "opacity-0 group-hover:opacity-100" : "opacity-100",
          )}
        >
          {playing ? (
            <Pause className="size-5" strokeWidth={2} fill="currentColor" />
          ) : (
            <Play className="size-5 ml-0.5" strokeWidth={2} fill="currentColor" />
          )}
        </span>
      </button>
    </div>
  );
}
