function factorial(n: number): number {
  if (n > 12) {
    throw new Error("Input too large"); // 12! = 479001600
  }

  return n <= 1 ? 1 : n * factorial(n - 1);
}

export function randomPermutationIndex(n: number): number {
  const max = factorial(n);
  console.log(`Generating random permutation index for n=${n}, max=${max}`);
  return Math.floor(Math.random() * max);
}

export function permutationToIndex(permutation: number[]): number {
  const n = permutation.length;
  let index = 0;
  const used = Array(n).fill(false);

  for (let i = 0; i < n; i++) {
    let smaller = 0;
    for (let j = 0; j < permutation[i]; j++) {
      if (!used[j]) smaller++;
    }
    index += smaller * factorial(n - 1 - i);
    used[permutation[i]] = true;
  }

  return index;
}

export function indexToPermutation(index: number, n: number): number[] {
  const elements = Array.from({ length: n }, (_, i) => i);
  const result: number[] = [];

  for (let i = n - 1; i >= 0; i--) {
    const f = factorial(i);
    const pos = Math.floor(index / f);
    index %= f;
    result.push(elements.splice(pos, 1)[0]);
  }

  return result;
}
