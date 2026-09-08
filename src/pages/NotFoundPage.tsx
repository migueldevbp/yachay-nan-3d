import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <>
      <h1 className="page-title">Página no encontrada</h1>
      <p className="page-lead">
        Esa dirección no existe en YACHAY ÑAN 3D. Vuelve al inicio para
        continuar.
      </p>
      <p>
        <Link to="/">Ir al inicio</Link>
      </p>
    </>
  );
}
