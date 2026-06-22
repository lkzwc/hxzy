"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import NextLink from 'next/link';

interface Feature {
  title: string;
  desc: string;
  image: string;
  stats: { label: string; value: string; unit: string }[];
  features: string[];
}

export default function ClientHeroSection({ features }: { features: Feature[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  }, [features.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  }, [features.length]);

  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
      {/* 轮播图片 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="absolute inset-0"
              style={{ display: index === currentIndex ? 'block' : 'none' }}
            >
              <div className="relative w-full h-full">
                {/* 图片遮罩渐变 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />

                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  priority={index === 0}
                  loading={index !== 0 ? "lazy" : undefined}
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={80}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlTz5Yb6bk+h0R//2Q=="
                  onLoad={() => index === 0 && setIsLoaded(true)}
                />

                {/* 内容覆盖层 */}
                <motion.div
                  className="absolute inset-0 z-20 p-8 flex flex-col justify-end"
                  initial={index === 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index === 0 ? 0 : 0.2, duration: index === 0 ? 0 : 0.5 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-sm mb-4 max-w-md">
                    {feature.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.features.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* 导航按钮 */}
      <div className="absolute bottom-4 right-4 z-30 flex gap-2">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="上一张"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="下一张"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 指示器 */}
      <div className="absolute bottom-4 left-4 z-30 flex gap-1.5">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`第 ${index + 1} 张`}
          />
        ))}
      </div>
    </div>
  );
}
