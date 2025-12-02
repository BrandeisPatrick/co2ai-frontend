import { motion } from 'framer-motion'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Light mode background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef7 50%, #f0e8f5 100%)',
          }}
        />

        {/* Animated orbs - Top left */}
        <motion.div
          className="absolute rounded-full mix-blend-multiply filter blur-3xl opacity-15"
          style={{
            background: 'linear-gradient(135deg, #c7d2e8 0%, #d4c5e2 100%)',
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
          className="absolute rounded-full mix-blend-multiply filter blur-3xl opacity-12"
          style={{
            background: 'linear-gradient(135deg, #d9d0e8 0%, #e0d4e2 100%)',
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
          className="absolute rounded-full mix-blend-multiply filter blur-3xl opacity-14"
          style={{
            background: 'linear-gradient(135deg, #d1dde8 0%, #cfe0f0 100%)',
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
          className="absolute rounded-full mix-blend-multiply filter blur-3xl opacity-12"
          style={{
            background: 'linear-gradient(135deg, #dcd0e8 0%, #d8d5f0 100%)',
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
