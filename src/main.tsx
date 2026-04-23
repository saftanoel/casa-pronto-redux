import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root")!;

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, <App />);
} else {
  createRoot(rootElement).render(<App />);
}

// Puppeteer fix pt așteptarea încărcării complete a paginii înainte de a începe procesul de prerendering
setTimeout(() => {
  document.dispatchEvent(new Event('prerender-ready'));
}, 1500);