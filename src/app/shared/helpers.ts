export function range(length: number): number[] {
    return Array.from({ length }, (_, i) => i);
}

// export class Letter {
//     character: 
// }

export function selectRandom(min: number, max: number, seedStr: string) {
  // Simple hash: create a numeric seed from string
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) & 0xffffffff;
  }
  // Linear Congruential Generator (LCG) step
  seed = (seed * 48271) % 0x7fffffff;
  // Normalize to 0..1
  let rand = seed / 0x7fffffff;
  // Scale to desired range
  return Math.floor(rand * (max - min + 1)) + min;
}