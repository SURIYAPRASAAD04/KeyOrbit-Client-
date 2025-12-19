/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* gray-500 with opacity */
        input: "var(--color-input)", /* white */
        ring: "var(--color-ring)", /* royal blue */
        background: "var(--color-background)", /* gray-50 with blue undertones */
        foreground: "var(--color-foreground)", /* near-black with blue undertones */
        primary: {
          DEFAULT: "var(--color-primary)", /* deep navy */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* royal blue */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red-500 */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* gray-50 */
          foreground: "var(--color-muted-foreground)", /* gray-500 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* launch orange */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* white */
          foreground: "var(--color-popover-foreground)", /* near-black with blue undertones */
        },
        card: {
          DEFAULT: "var(--color-card)", /* white */
          foreground: "var(--color-card-foreground)", /* near-black with blue undertones */
        },
        success: {
          DEFAULT: "var(--color-success)", /* emerald-500 */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber-500 */
          foreground: "var(--color-warning-foreground)", /* white */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red-500 */
          foreground: "var(--color-error-foreground)", /* white */
        },
        surface: "var(--color-surface)", /* white */
        "text-secondary": "var(--color-text-secondary)", /* gray-500 */
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      boxShadow: {
        'orbital': '0 4px 6px rgba(11, 11, 82, 0.07)',
        'orbital-md': '0 10px 15px rgba(11, 11, 82, 0.1)',
        'orbital-lg': '0 20px 25px rgba(11, 11, 82, 0.1)',
        'orbital-xl': '0 25px 50px rgba(11, 11, 82, 0.15)',
        'glow': '0 0 20px rgba(242, 140, 0, 0.3)',
        'glow-sm': '0 0 10px rgba(242, 140, 0, 0.2)',
      },
      backdropBlur: {
        'orbital': '20px',
      },
      animation: {
        'orbital-spin': 'orbital-spin 2s ease-in-out infinite',
        'fade-in': 'fadeIn 300ms ease-in-out',
        'slide-in': 'slideIn 200ms ease-out',
        'scale-in': 'scaleIn 150ms ease-out',
      },
      keyframes: {
        'orbital-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'orbital': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
      },
      zIndex: {
        '100': '100',
        '200': '200',
        '300': '300',
      },
      gridTemplateColumns: {
        'sidebar': '280px 1fr',
        'sidebar-collapsed': '80px 1fr',
      },
      minHeight: {
        'screen-header': 'calc(100vh - 4rem)',
      },
      maxWidth: {
        'sidebar': '280px',
        'sidebar-collapsed': '80px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}