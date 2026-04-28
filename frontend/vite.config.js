import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Validate configuration
  if (!env.BACKEND_URL && mode === 'production') {
    console.warn('[Vite] BACKEND_URL not set in production mode. API calls will fail.')
  }

  // Normalize BACKEND_URL: remove trailing slash
  const backendUrl = (env.BACKEND_URL || '').replace(/\/$/, '')

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true
    },
    define: {
      'process.env.BACKEND_URL': JSON.stringify(backendUrl),
      'process.env.ENV_MODE': JSON.stringify(mode)
    }
  }
})
