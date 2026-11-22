import { createRoot } from 'react-dom/client'
import App from './App.tsx'
// Schriften werden vom eigenen Server ausgeliefert (kein Abruf bei Google)
import '@fontsource/anton/400.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/600.css'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
