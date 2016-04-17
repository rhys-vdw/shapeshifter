function block(position) {
  return { type: 'block', position };
}

export function row(start, length) {
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(block({ x: start.x + i, y: start.y }));
  }
  return result;
}

export function ramp(start, length) {
  const result = [];
  for (let i = 0; i < length; i++) {
    const x = start.x + i;
    for (let j = 0; j < i; j++) {
      result.push(block({ x: x, y: start.y + j }));
    }
  }
  return result;
}
