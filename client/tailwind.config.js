/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1A4C95",
        secondary: "#E8EAF5",
        grey: "#D3D3D3",
      },
      // Thêm phần này để định nghĩa keyframes
      keyframes: {
        ring: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(10deg)" },
          "50%": { transform: "rotate(-10deg)" },
          "75%": { transform: "rotate(5deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      // Thêm phần này để định nghĩa animation
      animation: {
        ring: "ring 0.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
