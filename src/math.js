export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(from, to, amount) {
  return from + amount * (to - from);
}

export function lerpClamped(from, to, amount) {
  const unclamped = lerp(from, to, amount);
  return to > from
    ? clamp(unclamped, from, to)
    : clamp(unclamped, to, from);
}

export function moveToward(from, to, amount) {
  return from + Math.sign(to - from) * amount;
}

export function moveTowardClamped(from, to, amount) {
  const unclamped = moveToward(from, to, amount);
  return to > from
    ? clamp(unclamped, from, to)
    : clamp(unclamped, to, from);
}
