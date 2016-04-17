import { lerp } from './math';

export function outOf(total, shares = 1) {
  return shares > total || Math.random() * total > shares;
}

export function floatRange(from, to) {
  return lerp(from, to, Math.random());
}

export function intRange(from, to) {
  if (from > to) throw Error(`from: ${from}, to: ${to}`);
  return Math.floor(floatRange(from, to));
}
