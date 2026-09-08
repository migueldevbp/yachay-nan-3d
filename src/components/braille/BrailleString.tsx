import {
  BrailleCell,
  type BrailleCellSize,
} from '@/components/braille/BrailleCell';
import { describeDots } from '@/modules/braille';
import type { BrailleSpec } from '@/types/braille';
import { expandSpec } from '@/modules/braille';

interface BrailleStringProps {
  spec?: BrailleSpec;
  cells?: number[][];
  size?: BrailleCellSize;
  showDotNumbers?: boolean;
}

export function BrailleString({
  spec,
  cells,
  size = 'md',
  showDotNumbers = false,
}: BrailleStringProps) {
  const list = spec ? expandSpec(spec).map((cell) => cell.dots) : (cells ?? []);

  return (
    <div className="braille-string">
      {list.map((dots, index) => (
        <BrailleCell
          key={`${dots.join('-')}-${index}`}
          dots={dots}
          size={size}
          showDotNumbers={showDotNumbers}
          label={describeDots(dots, 'es')}
        />
      ))}
    </div>
  );
}
