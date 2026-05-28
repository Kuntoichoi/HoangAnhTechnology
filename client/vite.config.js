import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 7000, // Đặt cổng mới ở đây
    host: true, // Cho phép truy cập từ các thiết bị khác trong mạng
  },
});
