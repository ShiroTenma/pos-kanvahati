/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Font bersih seperti saranmu
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          // --- PALET WARNA PASTEL (Sesuai Request) ---
          
          "primary": "#8ABCE4",          // Pastel Blue (Warna Utama/Tombol)
          "primary-content": "#FFFFFF",  // Teks Putih di tombol biru
          
          "secondary": "#F7A8C9",        // Soft Pink (Aksen/Pemanis)
          "secondary-content": "#FFFFFF",
          
          "accent": "#F7A8C9",           // Pink juga (untuk highlights)
          
          "neutral": "#2C2C2C",          // Charcoal (Warna Gelap/Teks)
          "neutral-content": "#FFFFFF",
          
          "base-100": "#FFFFFF",         // White (Untuk Kartu/Wadah Konten)
          "base-200": "#FFF6D6",         // Cream/Beige (Background Halaman Dominan)
          "base-300": "#E6DEBF",         // Cream agak gelap (Border)
          
          "base-content": "#2C2C2C",     // Charcoal (Warna Teks Utama)

          "info": "#3ABFF8",
          "success": "#22C55E",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
};