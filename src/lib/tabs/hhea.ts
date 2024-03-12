import { B as bin } from '../Bin';
export interface IHHea {
  'ascender': number,
  'descender': number,
  'lineGap': number,
  'advanceWidthMax': number,
  'minLeftSideBearing': number,
  'minRightSideBearing': number,
  'xMaxExtent': number,
  'caretSlopeRise': number,
  'caretSlopeRun': number,
  'caretOffset': number,
  'res0': number,
  'res1': number,
  'res2': number,
  'res3': number,
  'metricDataFormat': number,
  'numberOfHMetrics': number
}
export class Hhea {
  ascender: number;
  descender: number;
  lineGap: number;
  advanceWidthMax: number;
  minLeftSideBearing: number;
  minRightSideBearing: number;
  xMaxExtent: number;
  caretSlopeRise: number;
  caretSlopeRun: number;
  caretOffset: number;
  res0: number;
  res1: number;
  res2: number;
  res3: number;
  metricDataFormat: number;
  numberOfHMetrics: number;
  constructor(data: Uint8Array, offset: number, length?: number) {
    let tableVersion = bin.readFixed(data, offset);
    offset += 4;

    // let keys = ['ascender', 'descender', 'lineGap',
    //   'advanceWidthMax', 'minLeftSideBearing', 'minRightSideBearing', 'xMaxExtent',
    //   'caretSlopeRise', 'caretSlopeRun', 'caretOffset',
    //   'res0', 'res1', 'res2', 'res3',
    //   'metricDataFormat', 'numberOfHMetrics'];
    //
    // for (let i = 0; i < keys.length; i++) {
    //   let key = keys[i];
    //   let func = (key === 'advanceWidthMax' || key === 'numberOfHMetrics') ? bin.readUshort : bin.readShort;
    //   this[key as keyof IHHea] = func(data, offset + i * 2);
    // }
    this.ascender = bin.readShort(data, offset + 0 * 2);
    this.descender = bin.readShort(data, offset + 1 * 2);
    this.lineGap = bin.readShort(data, offset + 2 * 2);
    this.advanceWidthMax = bin.readUshort(data, offset + 3 * 2);
    this.minLeftSideBearing = bin.readShort(data, offset + 4 * 2);
    this.minRightSideBearing = bin.readShort(data, offset + 5 * 2);
    this.xMaxExtent = bin.readShort(data, offset + 6 * 2);
    this.caretSlopeRise = bin.readShort(data, offset + 7 * 2);
    this.caretSlopeRun = bin.readShort(data, offset + 8 * 2);
    this.caretOffset = bin.readShort(data, offset + 9 * 2);
    this.res0 = bin.readShort(data, offset + 10 * 2);
    this.res1 = bin.readShort(data, offset + 11 * 2);
    this.res2 = bin.readShort(data, offset + 12 * 2);
    this.res3 = bin.readShort(data, offset + 13 * 2);
    this.metricDataFormat = bin.readShort(data, offset + 14 * 2);
    this.numberOfHMetrics = bin.readUshort(data, offset + 15 * 2);
  }
}
