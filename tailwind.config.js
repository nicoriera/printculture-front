/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif'],
        // TODO DOWNLOAD DM SERIF TEXT
        serif: ['DMSerifText', 'ui-serif']
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
