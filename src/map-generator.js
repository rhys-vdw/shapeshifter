import * as mapBuilder from './map-builder';
import * as random from './random';
import { flatten, times } from 'lodash';

const HEIGHT = 10;

function bounds(offset, length) {
  return flatten([
    mapBuilder.row({ x: offset, y: HEIGHT - 1 }, length),
    mapBuilder.row({ x: offset, y: -HEIGHT }, length),
  ]);
}

function rampInRange(offset, range, size) {
  return mapBuilder.ramp({
    x: offset + random.intRange(0, range - Math.abs(size)),
    y: -HEIGHT + 1
  }, size);
}

function rampsInRange(offset, range, rampCount, minSize, maxSize) {
  const segment = Math.floor(range / rampCount);
  return flatten(times(rampCount).map(i => {
    const rampOffset = offset + i * segment;
    const size = random.intRange(minSize, maxSize);
    return rampInRange(rampOffset, segment, size);
  }));
}

export function getSection(offset, length) {

  const rampLength = random.intRange(3, 6);

  return flatten([
    bounds(offset, length),
    //rampInRange(offset, length, random.range(3, 6))
    rampsInRange(
      offset, length,
      Math.floor(length / 10),
      -8,
      8
    )
  ]);
}
