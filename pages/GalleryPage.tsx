import React, { useState } from 'react';
import { GALLERY_IMAGES } from '../constants';

const GalleryPage: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const selectedImage = selected !== null ? GALLERY_IMAGES[selected] : null;

  const handlePrev = () => {
    if (selected === null) return;
    setSelected(selected === 0 ? GALLERY_IMAGES.length - 1 : selected - 1);
  };
  const handleNext = () => {
    if (selected === null) return;
    setSelected(selected === GALLERY_IMAGES.length - 1 ? 0 : selected + 1);
  };

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Header */}
      <div className="bg-ink-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-3">Dokumentasi Visual</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Lensa Peristiwa</h1>
          <p className="text-ink-400 text-lg max-w-xl mx-auto leading-relaxed">
            Koleksi foto jurnalistik terpilih yang merekam momen-momen penting dari seluruh penjuru Indonesia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-ink-500">{GALLERY_IMAGES.length} foto tersedia</p>
          <span className="text-xs text-ink-400 bg-white px-3 py-1.5 rounded-full border border-ink-200">Klik foto untuk memperbesar</span>
        </div>

        {/* Masonry-like Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {GALLERY_IMAGES.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelected(index)}
              className={`group relative rounded-xl overflow-hidden bg-ink-200 article-card cursor-zoom-in ${
                index === 0 || index === 5 ? 'col-span-2 row-span-2' : ''
              }`}
              style={{ aspectRatio: (index === 0 || index === 5) ? '1.5/1' : '1/1' }}
            >
              <img
                src={image.imageUrl}
                alt={image.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-white text-xs font-medium leading-snug">{image.caption}</p>
              </div>
              {/* Index badge */}
              <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white text-xs font-bold rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected !== null && selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          {/* Close */}
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Image */}
          <div
            className="max-w-5xl w-full mx-auto"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.caption}
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-medium text-sm">{selectedImage.caption}</p>
              <p className="text-ink-500 text-xs mt-1">
                Foto {selected + 1} dari {GALLERY_IMAGES.length}
              </p>
            </div>
            {/* Thumbnail strip */}
            <div className="flex gap-2 justify-center mt-4 overflow-x-auto pb-2">
              {GALLERY_IMAGES.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelected(idx)}
                  className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === selected ? 'border-brand-400 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
