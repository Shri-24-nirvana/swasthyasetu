import { useMemo } from "react";

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function QRCode({
  value,
  size = 96,
}: {
  value: string;
  size?: number;
}) {
  const cells = useMemo(() => {
    const seed = hash(value);
    const grid: boolean[][] = [];
    const n = 21;
    for (let y = 0; y < n; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < n; x++) {
        const isFinder =
          (x < 6 && y < 6) ||
          (x > n - 7 && y < 6) ||
          (x < 6 && y > n - 7);
        const inFinder =
          (x < 7 && y < 7) || (x > n - 8 && y < 7) || (x < 7 && y > n - 8);
        if (inFinder) {
          row.push(
            !(
              x > 0 && x < 6 && y > 0 && y < 6 && !(x === 1 || x === 5 || y === 1 || y === 5)
            )
          );
        } else if (isFinder) {
          row.push(false);
        } else {
          row.push(((seed >> ((x * 7 + y * 3) % 30)) & 1) === 1);
        }
      }
      grid.push(row);
    }
    return grid;
  }, [value]);

  const cell = size / cells.length;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {cells.map((row, y) =>
        row.map((filled, x) =>
          filled ? (
            <rect
              key={`${x}-${y}`}
              x={x * cell}
              y={y * cell}
              width={cell}
              height={cell}
              fill="currentColor"
            />
          ) : null
        )
      )}
    </svg>
  );
}