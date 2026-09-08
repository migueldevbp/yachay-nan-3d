/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        primary: 'var(--color-primary)',
        'primary-contrast': 'var(--color-primary-contrast)',
        focus: 'var(--color-focus)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        border: 'var(--color-border)',
      },
      fontSize: {
        base: 'var(--font-size-base)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      spacing: {
        unit: 'var(--spacing-unit)',
        touch: 'var(--touch-min)',
      },
      minHeight: {
        touch: 'var(--touch-min)',
      },
      minWidth: {
        touch: 'var(--touch-min)',
      },
      transitionDuration: {
        DEFAULT: 'var(--motion-duration)',
      },
    },
  },
  plugins: [],
};
