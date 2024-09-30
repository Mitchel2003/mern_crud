import { QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import React from 'react'

import queryClient from '@/lib/queryClient'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)