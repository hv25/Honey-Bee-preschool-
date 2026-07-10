import React, { useState, useEffect } from "react";
import { Image, Filter, Eye, Camera, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  icon: string;
}

const DEFAULT_GALLERY: GalleryPhoto[] = [
  { id: "1", title: "Circle-Time Puppet Storytelling", category: "classroom", icon: "🎭📖" },
  { id: "2", title: "Water Wheel Splash Play", category: "splash", icon: "splash" },
  { id: "3", title: "Anti-shock Foam Slide Arena", category: "play", icon: "🤸🎪" },
  { id: "4", title: "Honeycomb Tearing Mosaic Arts", category: "arts", icon: "🎨✂️" },
  { id: "5", title: "Phonetic Letter Puzzle Board", category: "classroom", icon: "🧩🔤" },
  { id: "6", title: "Clay Play Dough Molding", category: "arts", icon: "🏺👐" },
  { id: "7", title: "Measuring Volume Water Basin", category: "splash", icon: "🐳🧪" },
  { id: "8", title: "Garden Sensory Soil Planting", category: "play", icon: "🌻🌱" },
  { id: "9", title: "Building Block Coordination Towers", category: "classroom", icon: "🧱📐" }
];

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>(DEFAULT_GALLERY);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPhotos(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch gallery photos", err);
    }
  };

  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 5000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: "all", label: "Show All Hive Photos" },
    { id: "classroom", label: "Classrooms" },
    { id: "play", label: "Play Arena" },
    { id: "arts", label: "Arts & Crafts" },
    { id: "splash", label: "Splash Pool" },
  ];

  const filteredPhotos = activeFilter === "all" ? photos : photos.filter((p) => p.category === activeFilter);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-slate-50 border-y border-slate-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header titles */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-bold text-yellow-600 uppercase tracking-widest bg-yellow-50 px-3 py-1 rounded-full">
            Our Hive Moments
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Honey Bees Active Gallery
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Browse genuine daily captures from our Sweetwater preschool classrooms, outdoor organic gardens, splash pool activities, and creative art sessions.
          </p>

          {/* Category Filter Selector Buttons */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === cat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Image Grid with beautiful illustrations represent photo snapshots */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={photo.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedPhoto(photo)}
                className="bg-white border border-slate-200 p-4.5 rounded-[28px] shadow-xs hover:shadow-md hover:border-yellow-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="bg-slate-900 aspect-video rounded-2xl flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded text-[9px] text-white tracking-widest font-extrabold uppercase z-10">
                    {photo.category}
                  </div>
                  {photo.url ? (
                    <img
                      src={photo.url}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-5xl animate-pulse mb-3">{photo.icon}</div>
                  )}
                  <span className="text-xs text-slate-300 group-hover:opacity-100 opacity-60 transition-opacity flex items-center gap-1 font-mono z-10 bg-slate-950/40 px-2 py-0.5 rounded">
                    <ZoomIn size={12} /> Click to expand snapshot
                  </span>
                </div>

                <div className="pt-3.5 flex justify-between items-center">
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-slate-900">
                      {photo.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">Honeycomb Captured Series #{photo.id}</span>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-xl text-slate-400 group-hover:bg-yellow-400 group-hover:text-slate-900 transition-colors">
                    <Camera size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal lightbox zoom simulation */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 border border-yellow-200 cursor-default"
              >
                <div className="bg-slate-950 aspect-video rounded-2xl flex flex-col items-center justify-center p-12 relative overflow-hidden">
                  {selectedPhoto.url ? (
                    <img
                      src={selectedPhoto.url}
                      alt={selectedPhoto.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-8xl block animate-bounce">{selectedPhoto.icon}</span>
                  )}
                  <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded text-xs text-white uppercase tracking-wider font-extrabold z-10">
                    {selectedPhoto.category}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-black text-xl text-slate-950 leading-tight">
                      {selectedPhoto.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-sans">
                      Verified early learning class photo taken at Honey Bees Pre-School. Full privacy clearances verified.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
