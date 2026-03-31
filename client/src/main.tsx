import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@fontsource-variable/fira-code/index.css'
import 'reactflow/dist/style.css'
import './index.css'
import './main.css'
import App from './App.tsx'
import { ModalProvider } from './components/ui/modal/ModalProvider'
import { ClerkProvider } from '@clerk/react'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

const queryClient = new QueryClient()

createRoot(rootElement).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <div className="app-shell">
            <div className="app-shell__backdrop" aria-hidden="true">
              <div className="app-shell__gradient" />
              <div className="app-shell__glow" />
              <div className="app-shell__grid" />
            </div>
            <div className="app-shell__content">
              <App />
            </div>
          </div>
        </ModalProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>,
)
