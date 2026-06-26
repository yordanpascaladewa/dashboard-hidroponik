/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Ini akan menyapu bersih semua file di dalam src
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Jaga-jaga kalau Next.js membaca folder app
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}