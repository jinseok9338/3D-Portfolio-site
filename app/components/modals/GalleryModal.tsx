import { useEffect, useState } from 'react';
import { useSceneStore } from '~/stores/useSceneStore';

// 갤러리 이미지 (placeholder - 나중에 실제 이미지로 교체)
const GALLERY_IMAGES = [
  { src: '/images/gallery/1.jpg', title: '작품 1', description: '설명' },
  { src: '/images/gallery/2.jpg', title: '작품 2', description: '설명' },
  { src: '/images/gallery/3.jpg', title: '작품 3', description: '설명' },
];

/**
 * 갤러리 모달 - 이미지 갤러리
 */
export function GalleryModal() {
  const setActiveModal = useSceneStore((state) => state.setActiveModal);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClose = () => {
    setActiveModal(null);
  };

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : GALLERY_IMAGES.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < GALLERY_IMAGES.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentImage = GALLERY_IMAGES[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* 이미지 영역 */}
        <div className="relative aspect-[16/10] bg-black/50 rounded-lg overflow-hidden border border-white/10">
          {/* 실제 이미지가 있으면 표시, 없으면 placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-pink-400 text-2xl mb-2">{currentImage.title}</p>
              <p className="text-white/70">{currentImage.description}</p>
              <p className="text-white/40 text-sm mt-4">
                {currentIndex + 1} / {GALLERY_IMAGES.length}
              </p>
            </div>
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : GALLERY_IMAGES.length - 1))}
            className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            이전
          </button>

          {/* 도트 인디케이터 */}
          <div className="flex gap-2">
            {GALLERY_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'bg-pink-500 scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentIndex((prev) => (prev < GALLERY_IMAGES.length - 1 ? prev + 1 : 0))}
            className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            다음
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        {/* 안내 */}
        <div className="mt-6 text-center text-sm text-white/50">
          <p>← → 키로 이동 | ESC로 닫기</p>
        </div>
      </div>
    </div>
  );
}
