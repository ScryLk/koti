import type { Config } from 'tailwindcss'
import { heroui } from '@heroui/theme'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#2A8F9D',
            },
            secondary: {
              DEFAULT: '#2A8F9D',
            },
          },
        },
      },
    }),
  ],
} satisfies Config
