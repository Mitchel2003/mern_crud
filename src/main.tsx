import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react'
import ReactDOM from 'react-dom/client'
import React from 'react'

import queryClient from '@/lib/queryClient'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
    </QueryClientProvider>
  </React.StrictMode>
)