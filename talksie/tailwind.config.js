/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00d4ff',
          green: '#39ff14',
          pink: '#ff0080',
          purple: '#8b5cf6',
          gold: '#ffd700',
          red: '#ff073a'
        },
        character: {
          voldemort: {
            primary: '#0f172a',
            secondary: '#1e293b',
            accent: '#22c55e',
            glow: '#16a34a'
          },
          ironman: {
            primary: '#7f1d1d',
            secondary: '#991b1b',
            accent: '#fbbf24',
            glow: '#f59e0b'
          },
          doraemon: {
            primary: '#0ea5e9',
            secondary: '#0284c7',
            accent: '#fbbf24',
            glow: '#38bdf8'
          }
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'particle': 'particle 20s linear infinite'
      },
      keyframes: {
        glow: {
          from: {
            textShadow: '0 0 20px #00d4ff, 0 0 30px #00d4ff, 0 0 40px #00d4ff'
          },
          to: {
            textShadow: '0 0 30px #00d4ff, 0 0 40px #00d4ff, 0 0 50px #00d4ff'
          }
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        },
        shimmer: {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(100%)'
          }
        },
        particle: {
          '0%': {
            transform: 'translateY(100vh) rotate(0deg)',
            opacity: '0'
          },
          '10%': {
            opacity: '1'
          },
          '90%': {
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(-100vh) rotate(360deg)',
            opacity: '0'
          }
        }
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'futura': ['Futura', 'sans-serif']
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}