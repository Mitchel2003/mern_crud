import { QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import React from 'react'

import queryClient from '@/lib/queryClient'
import config from '@/utils/config'
import App from './App'
import './index.css'
// to pass the config to the service worker (firebase-messaging-sw.js)
(window as any).__FIREBASE_CONFIG__ = config.firebaseConfig
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)