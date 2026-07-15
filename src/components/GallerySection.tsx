import React, { useState, useEffect } from "react";
import { Image, Camera, ZoomIn, ExternalLink, Play, Plus, X, Upload, Trash2, Link2, Film, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LazyGalleryMedia from "./LazyGalleryMedia";

interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  icon: string;
  url?: string;
  type?: "image" | "video";
}

const GOOGLE_GALLERY_URL = "https://www.google.com/search?client=ms-android-vivo-terr1-rso2&hs=1Nv&sca_esv=687c80ba214a4f2f&biw=392&bih=742&sxsrf=APpeQnvvtNuyr7GT4N9PyR5QIJsCaprqcg:1784051066402&q=honey+bees+pre-school+,daycare+and+tuition+centre+visakhapatnam+photos&uds=AJ5uw19Z9yB6lfd0F3E4CWF3ZfQMaxpr0PFQCgpGtCT5YUtdaiaHTulE2oFR1CK4ZB3I3Ivv2DPV_2AaSusyqDOLOMLZ-wC5IKqNXHcCQoZtgmSITfPCzoxq2eLCfbqRvatR-5dtijopyLJa_yaViraNsiExnpwvxdBLmU2Pd2dVoqvH6FRDsdR5SIQhEjtY10IqGxNQJTW-dCoShEWD3-9ncx-K80660BJRoeZsjiiXwn0Rtul71hqLoWlaINFlQtbq6OmP0y2Vsy_yOU0zzZThEvYQFFhPjdinDdEG5-8UQ3s2Ko1KK9CaumLgKOxEuOSCyqzrBYL5Gh8jssV89gqZm2NC8zOEE6GxfbGz_EPgggWpr_bzpugnW5jJC7mVv94t4SyUh6iWseK1WQVfQZtBGvTs6gVoUHAu4UK1sDNTSwGqCU11jq47z-a9tiPK103oUo3ewpoGzAcy_ocMbo3nx4rewI8UMDo29cQxHls2JdffuimEgL8iWqgOScGu4V75_3e0MKpAwJO9bImJt7wcHftiJqJLejj3aNnM3dTFGROTtxLeQ68OI4UlHV_uTeZB2fgmkbeGBCNd2aiuHLD0SuUr6rkQ8PvFQcSWpkEhi3AmjYIEXpsC6y9trPnnp_UpYBdE0Lz_&si=APenkKlaTGqMSNE-WcX9vHZS2IwHzctXcdIEP2KByn5X7f9y831-zifZHSMkNx6w3Kv27xnFW_Jk0Ho85rOF4o9RKfjgycIjgL9UNLTOFLHmhZW0wc4TZfHnY9u8DwaIA_U2amApjc-erUvdZmDXWkJUh9bnnEStqdNj6h7naHPXV2smgFWNx4qOJdR8uH6ZEWBXRis2m7aF&sa=X&ved=2ahUKEwilvMuQ3NKVAxViWOsIHY4qPLsQk8gLegQIGhAB&ictx=1&stq=1&cs=1&lei=enVWaqWXGOKwrfcPjtXw2Qs#ebo=4&lpg=cid:CgIgAQ%3D%3D";

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Upload Modal States
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [photoTitle, setPhotoTitle] = useState<string>("");
  const [photoCategory, setPhotoCategory] = useState<string>("classroom");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [pastedUrl, setPastedUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPhotos(data);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch gallery photos gracefully:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    
    const checkAdmin = () => {
      try {
        const storedUser = localStorage.getItem("honeybees_current_user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setIsAdmin(user?.role === "admin");
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setIsAdmin(false);
      }
    };

    checkAdmin();
    const interval = setInterval(() => {
      fetchPhotos();
      checkAdmin();
    }, 5000);

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

  const handleOpenGoogleGallery = () => {
    window.open(GOOGLE_GALLERY_URL, "_blank", "noopener,noreferrer");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > (mediaType === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024)) {
        setFormError(`File is too large. Max size is ${mediaType === "video" ? "50MB" : "10MB"}.`);
        return;
      }
      setFormError(null);
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) {
      setFormError("Activity / Event Title is required.");
      return;
    }
    if (uploadMode === "file" && !filePreview) {
      setFormError("Please choose a file to upload.");
      return;
    }
    if (uploadMode === "url" && !pastedUrl.trim()) {
      setFormError("Please paste a photo or video URL.");
      return;
    }

    setIsUploading(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      let res;
      if (uploadMode === "file" && filePreview) {
        res = await fetch("/api/admin/gallery/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: filePreview,
            title: photoTitle,
            category: photoCategory,
            type: mediaType
          }),
        });
      } else {
        res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: photoTitle,
            category: photoCategory,
            icon: mediaType === "video" ? "🎬" : "📸",
            url: pastedUrl,
            type: mediaType
          }),
        });
      }

      const data = await res.json();
      if (res.ok) {
        setFormSuccess(data.message || "Media added successfully!");
        setPhotoTitle("");
        setSelectedFile(null);
        setFilePreview(null);
        setPastedUrl("");
        fetchPhotos();
        setTimeout(() => {
          setIsUploadOpen(false);
          setFormSuccess(null);
        }, 1800);
      } else {
        setFormError(data.error || "Failed to add media.");
      }
    } catch (err: any) {
      setFormError("Error uploading media. Please check your network.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-150 dark:border-slate-800/85 transition-colors duration-350">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header titles */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest bg-yellow-50 dark:bg-yellow-950/40 px-3 py-1 rounded-full">
            Our Hive Moments
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Honey Bees Active Gallery
          </h2>
          <p className="text-slate-500 dark:text-slate-350 text-xs sm:text-sm leading-relaxed">
            Browse genuine daily captures from our Lawsons Bay preschool classrooms, outdoor organic gardens, splash pool activities, and creative art sessions.
          </p>

          {/* Real-Time Google Power Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/60 dark:border-yellow-900/20 p-4.5 rounded-2xl text-left max-w-2xl mx-auto mt-6 flex gap-3.5 items-start shadow-sm animate-fade-in">
            <span className="text-2xl mt-0.5 shrink-0">📡</span>
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Real-Time Google Integration Enabled
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Our active photo and video stream is linked directly to Google Maps & Search. As we post new memories on Google, they are instantly available here! Click any snapshot card to browse our official live feed.
              </p>
            </div>
          </div>

          {/* Active Actions: View on Google & Add Directly on Website */}
          <div className="pt-4 flex flex-col items-center gap-3 justify-center">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleOpenGoogleGallery}
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold px-6 py-3 rounded-full text-xs shadow-lg transition-all cursor-pointer hover:shadow-yellow-400/20 active:scale-95"
              >
                <span>⭐ View Live Photos & Videos on Google</span>
                <ExternalLink size={13} />
              </button>
              {isAdmin && (
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold px-6 py-3 rounded-full text-xs shadow-lg transition-all cursor-pointer hover:shadow-slate-900/10 active:scale-95 animate-pulse"
                >
                  <Plus size={14} />
                  <span>Add Photo / Video (Admin)</span>
                </button>
              )}
            </div>
            {!isAdmin ? (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                🛡️ Gallery curation is locked. Only school administrators can publish or remove memories.
              </p>
            ) : (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                ⚡ Welcome, Admin! You have direct clearance to add or delete live highlights from this stream.
              </p>
            )}
          </div>

          {/* Category Filter Selector Buttons (Only show when we have photos to filter) */}
          {photos.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 pt-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilter === cat.id
                      ? "bg-slate-900 dark:bg-slate-850 text-white shadow-xs"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Image Grid with interactive cards */}
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        ) : photos.length === 0 ? (
          /* High-Quality Styled Empty/Placeholder State */
          <div className="max-w-2xl mx-auto text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 sm:p-12 shadow-sm space-y-6">
            <div className="w-20 h-20 bg-yellow-50 dark:bg-yellow-950/40 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
              📸
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                Awaiting First Uploads
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                The static gallery placeholder has been cleared! All new memories and live daily highlights will be managed directly. Upload photos or videos to Google Maps to feature them here, or click below to upload directly to our website gallery!
              </p>
            </div>
            <div className="pt-4 flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold px-5 py-2.5 rounded-full text-xs transition-all cursor-pointer"
              >
                <Plus size={13} />
                <span>Add First Media</span>
              </button>
              <button
                onClick={handleOpenGoogleGallery}
                className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold px-5 py-2.5 rounded-full text-xs transition-all cursor-pointer"
              >
                <ExternalLink size={12} />
                <span>Add Photo to Google Maps</span>
              </button>
            </div>
          </div>
        ) : (
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
                  onClick={handleOpenGoogleGallery}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-[28px] shadow-xs hover:shadow-md hover:border-yellow-300 dark:hover:border-yellow-400/45 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="bg-slate-900 aspect-video rounded-2xl flex flex-col items-center justify-center p-6 relative overflow-hidden">
                    <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded text-[9px] text-white tracking-widest font-extrabold uppercase z-10">
                      {photo.category}
                    </div>
                    <LazyGalleryMedia url={photo.url} alt={photo.title} type={photo.type} icon={photo.icon} />
                    
                    {/* Hover action overlay */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 z-20 text-white p-4 text-center">
                      <ExternalLink size={20} className="text-yellow-400 animate-bounce" />
                      <span className="text-xs font-black">Open Google Active Stream</span>
                      <span className="text-[10px] text-slate-300 font-mono">Instant Real-Time Updates</span>
                    </div>

                    <span className="text-xs text-slate-300 group-hover:opacity-0 opacity-60 transition-opacity flex items-center gap-1 font-mono z-10 bg-slate-950/40 px-2 py-0.5 rounded">
                      {photo.type === "video" ? "🎬 Click to preview video on Google" : <><ZoomIn size={12} /> Click to view on Google</>}
                    </span>
                  </div>

                  <div className="pt-3.5 flex justify-between items-center">
                    <div>
                      <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                        {photo.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 block">Honeycomb Captured Series #{photo.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete "${photo.title}"?`)) {
                              try {
                                const res = await fetch(`/api/admin/gallery/${photo.id}`, { method: "DELETE" });
                                if (res.ok) {
                                  fetchPhotos();
                                } else {
                                  alert("Failed to delete photo");
                                }
                              } catch (err) {
                                console.error(err);
                                alert("Error deleting photo");
                              }
                            }
                          }}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl transition-colors cursor-pointer shrink-0"
                          title="Delete snapshot"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <div className="bg-slate-100 dark:bg-slate-850 p-2 rounded-xl text-slate-400 dark:text-slate-500 group-hover:bg-yellow-400 group-hover:text-slate-900 dark:group-hover:text-slate-900 transition-colors shrink-0">
                        <ExternalLink size={14} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* Stunning Interactive Direct Upload Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUploading && setIsUploadOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden z-10"
            >
              <button
                onClick={() => !isUploading && setIsUploadOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-all"
                disabled={isUploading}
              >
                <X size={18} />
              </button>

              <div className="space-y-1 mb-6">
                <h3 className="font-display font-black text-xl text-slate-900">
                  Add Photo or Video to Gallery
                </h3>
                <p className="text-slate-500 text-xs">
                  Upload a local media file or paste a Google Photos/Video stream link.
                </p>
              </div>

              {formSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle size={32} />
                  </div>
                  <p className="font-bold text-sm text-slate-950">{formSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleAddMedia} className="space-y-4 text-xs">
                  
                  {/* Media Type Toggle */}
                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wider text-[9px]">
                      Media Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMediaType("image");
                          setSelectedFile(null);
                          setFilePreview(null);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          mediaType === "image"
                            ? "bg-yellow-400 text-slate-900 shadow-xs"
                            : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <Camera size={14} />
                        Image
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMediaType("video");
                          setSelectedFile(null);
                          setFilePreview(null);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          mediaType === "video"
                            ? "bg-yellow-400 text-slate-900 shadow-xs"
                            : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <Film size={14} />
                        Video
                      </button>
                    </div>
                  </div>

                  {/* Input Method Toggle (File vs Link) */}
                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wider text-[9px]">
                      Input Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setUploadMode("file")}
                        className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          uploadMode === "file"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        Upload Local File
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMode("url")}
                        className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          uploadMode === "url"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        Paste Web Link
                      </button>
                    </div>
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[9px]">
                      Activity / Event Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Clay Play Dough Molding"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs"
                      required
                    />
                  </div>

                  {/* Category Select */}
                  <div>
                    <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[9px]">
                      Gallery Category
                    </label>
                    <select
                      value={photoCategory}
                      onChange={(e) => setPhotoCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs bg-white"
                    >
                      <option value="classroom">Classrooms & Reading</option>
                      <option value="play">Play Arena & Sensory</option>
                      <option value="arts">Arts & Crafts</option>
                      <option value="splash">Splash Pool Activities</option>
                    </select>
                  </div>

                  {/* File Upload Zone */}
                  {uploadMode === "file" ? (
                    <div>
                      <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[9px]">
                        Choose file to upload
                      </label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 hover:border-yellow-400 transition-colors relative flex flex-col items-center justify-center">
                        {filePreview ? (
                          <div className="w-full relative">
                            {mediaType === "video" ? (
                              <video
                                src={filePreview}
                                controls
                                className="w-full aspect-video object-cover rounded-lg border border-slate-200"
                              />
                            ) : (
                              <img
                                src={filePreview}
                                alt="Preview"
                                className="w-full aspect-video object-cover rounded-lg border border-slate-200"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null);
                                setFilePreview(null);
                              }}
                              className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-full hover:bg-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center cursor-pointer w-full py-4 text-slate-400 hover:text-slate-600">
                            <Upload size={20} className="mb-1 text-slate-400 animate-pulse" />
                            <span className="font-semibold text-[11px]">Click to choose {mediaType}</span>
                            <span className="text-[9px] text-slate-400 mt-0.5">
                              {mediaType === "video" ? "MP4, WebM, MOV up to 50MB" : "PNG, JPG, JPEG up to 10MB"}
                            </span>
                            <input
                              type="file"
                              accept={mediaType === "video" ? "video/*" : "image/*"}
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Web Link Paste Zone */
                    <div>
                      <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[9px]">
                        Paste Photo or Video URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          placeholder={mediaType === "video" ? "https://example.com/video.mp4" : "https://example.com/photo.jpg"}
                          value={pastedUrl}
                          onChange={(e) => setPastedUrl(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs"
                          required
                        />
                        <Link2 size={14} className="absolute left-3.5 top-3 text-slate-400" />
                      </div>
                    </div>
                  )}

                  {/* Feedback Message */}
                  {formError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-600 px-3.5 py-2 rounded-xl text-[11px] leading-relaxed">
                      {formError}
                    </div>
                  )}

                  {/* Actions Submit */}
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => !isUploading && setIsUploadOpen(false)}
                      className="w-1/3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3 rounded-xl transition-all cursor-pointer"
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-slate-900" />
                          <span>Saving media...</span>
                        </>
                      ) : (
                        <span>Publish to Website</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
