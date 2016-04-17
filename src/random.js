import { lerp } from './math';

export function outOf(total, shares = 1) {
  return shares > total || Math.random() * total > shares;
}

export function range(from, to) {
  return lerp(from, to, Math.random());
}

export function intRange(from, to) {
  return Math.floor(range(from, to));
}
