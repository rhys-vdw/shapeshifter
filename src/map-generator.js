import * as mapBuilder from './map-builder';
import { flatten } from 'lodash';

const HEIGHT = 10;

export function getSection(offset, length) {
  return flatten([
    mapBuilder.row({ x: offset, y: HEIGHT - 1 }, length),
    mapBuilder.row({ x: offset, y: -HEIGHT }, length)
  ]);
}
