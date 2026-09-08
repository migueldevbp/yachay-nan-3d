import { useEffect, type MouseEvent } from 'react';
import { Link, Outlet } from 'react-router-dom';

const DOCUMENT_TITLE = 'YACHAY ÑAN 3D';

export function App() {
  useEffect(() => {
    document.title = DOCUMENT_TITLE;
  }, []);

  function handleSkipLink(event: MouseEvent<HTMLAnchorElement>) {
    /*
      Con createHashRouter el hash de la URL es la ruta. Un href="#contenido"
      lo interpretaría el router como otra ruta. Evitamos eso y movemos el
      foco al <main>, que es el comportamiento correcto del skip link.
    */
    event.preventDefault();
    const main = document.getElementById('contenido');
    main?.focus();
  }

  return (
    <div className="app-shell min-h-screen bg-bg text-text">
      <a href="#contenido" className="skip-link" onClick={handleSkipLink}>
        Saltar al contenido principal
      </a>
      <header className="app-header">
        <Link to="/" className="app-brand">
          YACHAY ÑAN 3D
        </Link>
        <nav className="app-nav" aria-label="Principal">
          <Link to="/">Inicio</Link>
        </nav>
      </header>
      <main id="contenido" className="app-main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>
          YACHAY ÑAN 3D · proyecto de código abierto · licencia MIT · Fase 01
        </p>
      </footer>
      <div id="announcer" aria-live="polite" aria-atomic="true" />
    </div>
  );
}
