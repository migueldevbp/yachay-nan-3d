import { cx } from '@/utils/cx';
import type { ResourceCardVariant } from '@/components/resource/types';

/**
 * Tipografía del carácter grande: Verdana, Tahoma, Segoe UI.
 * Verdana y Tahoma distinguen I (palo con remates leves), l (curva/cola)
 * y 1 (asta con base). No cargamos fuentes remotas: el sitio debe funcionar
 * offline. Contraste: color de texto sobre fondo de superficie ≥ 7:1
 * (tokens actuales ~15:1 en claro y oscuro, 21:1 en alto contraste).
 */
interface CharacterDisplayProps {
  character: string;
  variant: ResourceCardVariant;
}

export function CharacterDisplay({ character, variant }: CharacterDisplayProps) {
  return (
    <p
      className={cx(
        'resource-character',
        `resource-character--${variant}`,
      )}
      lang="es"
    >
      {character}
    </p>
  );
}
