import React, { useState, useEffect, useRef } from "react";

interface LazyGalleryMediaProps {
  url?: string;
  alt: string;
  type?: "image" | "video";
  icon?: string;
}

export default function LazyGalleryMedia({ url, alt, type = "image", icon }: LazyGalleryMediaProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up intersection observer to load media when it is close to the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "250px 0px", // Preload 250px before entering viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!url) {
    return (
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-5xl animate-pulse">
        <span>{icon || "📸"}</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-slate-50 dark:bg-slate-900"
    >
      {/* Smooth Blur-up / Shimmer Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl animate-bounce">🐝</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
              Hive Loading...
            </span>
          </div>
        </div>
      )}

      {/* Actual Media element rendered upon entering view */}
      {isInView && (
        type === "video" ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-950">
            <video
              src={url}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                isLoaded ? "opacity-80 blur-0 scale-100" : "opacity-0 blur-md scale-105"
              }`}
              muted
              playsInline
              loop
              preload="metadata"
              onLoadedData={() => setIsLoaded(true)}
            />
            {isLoaded && (
              <>
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />
                <div className="absolute bg-yellow-400 text-slate-900 p-3 rounded-full shadow-lg z-10 transform group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </>
            )}
          </div>
        ) : (
          <img
            src={url}
            alt={alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105"
            }`}
          />
        )
      )}
    </div>
  );
}
