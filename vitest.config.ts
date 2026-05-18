import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true, // Дозволяє використовувати 'vi', 'describe', 'it' без імпорту в кожному файлі
    setupFiles: './src/vitest-setup.ts', // Вказуємо файл, де будуть лежати наші заглушки
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})