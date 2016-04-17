export function row(start, length) {
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push({
      type: 'block',
      position: {
        x: start.x + i, y: start.y
      }
    });
  }
  return result;
}
