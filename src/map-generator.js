import * as mapBuilder from './map-builder';
import { flatten } from 'lodash';

const HEIGHT = 10;

function bounds(offset, length) {
  return flatten([
    mapBuilder.row({ x: offset, y: HEIGHT - 1 }, length),
    mapBuilder.row({ x: offset, y: -HEIGHT }, length),
  ]);
}

export function getSection(offset, length) {
  return flatten([
    bounds(offset, length),
    mapBuilder.ramp({ x: offset, y: -HEIGHT + 1}, 5)
  ]);
}
