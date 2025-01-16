import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function OptimizedImage({
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  priority = false,
}: OptimizedImageProps) {
  const [isLoading, setLoading] = useState(true)

  return (
    <div className={`${fill ? 'relative w-full h-full' : ''} overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`
          ${className}
          ${isLoading ? 'blur-2xl scale-110' : 'blur-0 scale-100'}
          transition-all duration-700
        `}
        priority={priority}
        quality={90}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  )
} 