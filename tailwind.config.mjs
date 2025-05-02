// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
const config = {
    content: [
      './src/pages/**/*.{js,jsx}',
      './src/components/**/*.{js,jsx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  };
  
  export default config;