'use client'

import Link from 'next/link'
import { RightOutlined, BookOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  },
  tap: {
    scale: 0.95
  }
}

export default function HomeButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
      <motion.div
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <Link 
          href="/community" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 
            text-white font-semibold rounded-full shadow-lg shadow-primary-500/30 hover:shadow-xl 
            hover:shadow-primary-500/40 transition-all duration-300 group"
        >
          <span>进入社区</span>
          <RightOutlined className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      <motion.div
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <Link 
          href="/about" 
          className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm text-primary-600 
            font-semibold rounded-full shadow-lg shadow-gray-200/50 hover:shadow-xl 
            hover:shadow-gray-200/70 border border-gray-100 transition-all duration-300 group"
        >
          <BookOutlined className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          <span>了解更多</span>
        </Link>
      </motion.div>
    </div>
  )
}