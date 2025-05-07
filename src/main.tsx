
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-javascript'
import { DirectionProvider } from '@radix-ui/react-direction'
import 'prismjs/themes/prism.css'

// Create a client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <DirectionProvider dir="ltr">
          <App />
          <Toaster />
        </DirectionProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
