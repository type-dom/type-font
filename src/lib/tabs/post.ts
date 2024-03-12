import { B } from '../Bin';
export class Post {
  version: number;
  italicAngle: number;
  underlinePosition: number;
  underlineThickness: number;
  constructor(data: Uint8Array, offset: number, length?: number) {
    this.version = B.readFixed(data, offset);
    offset += 4;
    this.italicAngle = B.readFixed(data, offset);
    offset += 4;
    this.underlinePosition = B.readShort(data, offset);
    offset += 2;
    this.underlineThickness = B.readShort(data, offset);
    offset += 2;
  }
}
