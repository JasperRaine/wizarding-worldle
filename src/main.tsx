import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StoreProvider } from './store/StoreProvider'
import * as Sentry from "@sentry/react";


Sentry.init({
  dsn: "https://5f9de741e5e64dd1791d62625186f335@o4510216814133248.ingest.de.sentry.io/4510216815444048",
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>,
)
