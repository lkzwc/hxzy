'use client'
import { motion } from 'framer-motion';

interface VerticalTitleProps {
  title: string;
  subtitle: string;
}

export default function VerticalTitle({ title, subtitle }: VerticalTitleProps) {
  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed left-0 w-[15px] z-10 hidden md:block"
    >
      <div className="relative h-[280px] mt-[20px]">
        <motion.div
          className="absolute inset-0 bg-primary/90 rounded-r-lg -z-10 w-[40px] "
          animate={{
            skewY: [0, 1, 0, -1, 0],
            translateY: [0, -1, 0, 1, 0],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        
        <div className="py-6 px-2 text-background">
          <motion.h1 
            className="text-base font-bold writing-vertical-rl"
            animate={{
              translateY: [0, -3, 0, 3, 0],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0.2,
            }}
          >
            {title}
          </motion.h1>
          <motion.p 
            className="mt-4 text-background/80 writing-vertical-rl text-xs"
            animate={{
              translateY: [0, -1, 0, 1, 0],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0.4,
            }}
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
} 