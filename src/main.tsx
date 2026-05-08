import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// StrictMode double-mounts components in dev, doubling WebGL context creation.
// Disabled to avoid exhausting the browser's GL context limit during HMR.
createRoot(document.getElementById('root')!).render(<App />)
