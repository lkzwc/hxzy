import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QrCode {
  id: string;
  description: string;
  imageUrl: string;
}

interface QrCodeCarouselProps {
  qrCodes: QrCode[];
}

export default function QrCodeCarousel({ qrCodes = [] }: QrCodeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 只有多于一个二维码时才自动轮播
  useEffect(() => {
    if (!Array.isArray(qrCodes) || qrCodes.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % qrCodes.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [qrCodes, isHovered]);

  if (!Array.isArray(qrCodes) || qrCodes.length === 0) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + qrCodes.length) % qrCodes.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % qrCodes.length);
  };

  return (
    <div 
      className="relative bg-white rounded-xl shadow-lg p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">关注我们</h3>
      
      <div className="relative aspect-square">
        {qrCodes.map((qrCode, index) => (
          <div
            key={qrCode.id}
            className={`absolute inset-0 transition-all duration-500 ${
              index === currentIndex
                ? 'opacity-100 translate-x-0'
                : index < currentIndex
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={qrCode.imageUrl}
                alt={qrCode.id}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">{qrCode.description}</p>
            </div>
          </div>
        ))}
      </div>

      {qrCodes.length > 1 && (
        <>
          {/* 导航按钮 */}
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow-lg flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow-lg flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 指示器 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {qrCodes.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-6 bg-primary'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
} 