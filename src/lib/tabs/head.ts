import { B as bin } from '../Bin';
export interface IHead {
  fontRevision: number,
  flags: number,
  unitsPerEm: number,
  created: number,
  modified: number,
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number,
  macStyle: number,
  lowestRecPPEM: number,
  fontDirectionHint: number,
  indexToLocFormat: number,
  glyphDataFormat: number,
}
export class Head {
  fontRevision: number;
  flags: number;
  unitsPerEm: number;
  created: number;
  modified: number;
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  macStyle: number;
  lowestRecPPEM: number;
  fontDirectionHint: number;
  indexToLocFormat: number;
  glyphDataFormat: number;
  constructor(data: Uint8Array, offset: number, length?: number) {
    let tableVersion = bin.readFixed(data, offset);
    offset += 4;
    this.fontRevision = bin.readFixed(data, offset);
    offset += 4;
    let checkSumAdjustment = bin.readUint(data, offset);
    offset += 4;
    let magicNumber = bin.readUint(data, offset);
    offset += 4;
    this.flags = bin.readUshort(data, offset);
    offset += 2;
    this.unitsPerEm = bin.readUshort(data, offset);
    offset += 2;
    this.created = bin.readUint64(data, offset);
    offset += 8;
    this.modified = bin.readUint64(data, offset);
    offset += 8;
    this.xMin = bin.readShort(data, offset);
    offset += 2;
    this.yMin = bin.readShort(data, offset);
    offset += 2;
    this.xMax = bin.readShort(data, offset);
    offset += 2;
    this.yMax = bin.readShort(data, offset);
    offset += 2;
    this.macStyle = bin.readUshort(data, offset);
    offset += 2;
    this.lowestRecPPEM = bin.readUshort(data, offset);
    offset += 2;
    this.fontDirectionHint = bin.readShort(data, offset);
    offset += 2;
    this.indexToLocFormat = bin.readShort(data, offset);
    offset += 2;
    this.glyphDataFormat = bin.readShort(data, offset);
    offset += 2;
  }
}
