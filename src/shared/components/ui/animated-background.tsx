import { motion } from 'framer-motion'
import { useTheme } from '@/shared'

export function AnimatedBackground() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
              : 'linear-gradient(135deg, #f0f4f8 0%, #e8eef7 50%, #f0e8f5 100%)',
          }}
        />

        {/* Animated orbs - Top left */}
        <motion.div
          className={`absolute rounded-full filter blur-3xl ${isDark ? 'mix-blend-screen opacity-10' : 'mix-blend-multiply opacity-15'}`}
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #1e3a5f 0%, #2d1b4e 100%)'
              : 'linear-gradient(135deg, #c7d2e8 0%, #d4c5e2 100%)',
            width: '500px',
            height: '500px',
            top: '-100px',
            left: '-100px',
          }}
          animate={{
            x: [0, 80, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Animated orbs - Top right */}
        <motion.div
          className={`absolute rounded-full filter blur-3xl ${isDark ? 'mix-blend-screen opacity-8' : 'mix-blend-multiply opacity-12'}`}
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #2d1b4e 0%, #1e3a5f 100%)'
              : 'linear-gradient(135deg, #d9d0e8 0%, #e0d4e2 100%)',
            width: '450px',
            height: '450px',
            top: '-50px',
            right: '-50px',
          }}
          animate={{
            x: [0, -60, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Animated orbs - Bottom left */}
        <motion.div
          className={`absolute rounded-full filter blur-3xl ${isDark ? 'mix-blend-screen opacity-10' : 'mix-blend-multiply opacity-14'}`}
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #0d4f4f 0%, #1e3a5f 100%)'
              : 'linear-gradient(135deg, #d1dde8 0%, #cfe0f0 100%)',
            width: '480px',
            height: '480px',
            bottom: '-100px',
            left: '20%',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Animated orbs - Bottom right */}
        <motion.div
          className={`absolute rounded-full filter blur-3xl ${isDark ? 'mix-blend-screen opacity-8' : 'mix-blend-multiply opacity-12'}`}
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #2d1b4e 0%, #0d4f4f 100%)'
              : 'linear-gradient(135deg, #dcd0e8 0%, #d8d5f0 100%)',
            width: '420px',
            height: '420px',
            bottom: '-80px',
            right: '5%',
          }}
          animate={{
            x: [0, -90, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  )
}
