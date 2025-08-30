import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Apply light mode theme
document.documentElement.classList.add('light');

createRoot(document.getElementById("root")!).render(<App />);
