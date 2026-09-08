import { IconButton } from '@/components/ui/IconButton';

/** Comprueba en typecheck que aria-label es obligatorio. */
export function IconButtonTypeCheck() {
  return (
    <>
      {/* @ts-expect-error aria-label es obligatorio en IconButton */}
      <IconButton>x</IconButton>
      <IconButton aria-label="Cerrar">x</IconButton>
    </>
  );
}
