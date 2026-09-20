export function levenshtein(left: string, right: string): number {
  const rows = left.length + 1;
  const columns = right.length + 1;
  const matrix = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => 0),
  );
  for (let row = 0; row < rows; row += 1) {
    const current = matrix[row];
    if (current !== undefined) {
      current[0] = row;
    }
  }
  fill(matrix, left, right);
  return (
    matrix[left.length]?.[right.length] ?? Math.max(left.length, right.length)
  );
}

function fill(matrix: number[][], left: string, right: string): void {
  for (let row = 1; row <= left.length; row += 1) {
    const current = matrix[row];
    const previous = matrix[row - 1];
    if (current === undefined || previous === undefined) {
      continue;
    }
    current[0] = row;
    fillRow({ current, previous, leftCharacter: left[row - 1] ?? "", right });
  }
}

type RowFill = {
  readonly current: number[];
  readonly previous: number[];
  readonly leftCharacter: string;
  readonly right: string;
};

function fillRow(input: RowFill): void {
  for (let column = 1; column <= input.right.length; column += 1) {
    const cost = input.leftCharacter === input.right[column - 1] ? 0 : 1;
    input.current[column] = Math.min(
      (input.previous[column] ?? 0) + 1,
      (input.current[column - 1] ?? 0) + 1,
      (input.previous[column - 1] ?? 0) + cost,
    );
  }
}
