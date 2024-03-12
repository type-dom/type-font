import { B as bin } from '../Bin';
import { TypeFont } from '../type-font';
export class Hmtx {
  aWidth: number[];
  lsBearing: number[];
  constructor(data: Uint8Array, offset: number, length: number, font: TypeFont) {
    const aWidth = [];
    const lsBearing = [];
    let nG = font.maxp?.numGlyphs || 0;
    let nH = font.hhea?.numberOfHMetrics || 0;
    let aw = 0;
    let lsb = 0;
    let i = 0;
    while (i < nH) {
      aw = bin.readUshort(data, offset + (i << 2));
      lsb = bin.readShort(data, offset + (i << 2) + 2);
      aWidth.push(aw);
      lsBearing.push(lsb);
      i++;
    }
    while (i < nG) {
      aWidth.push(aw);
      lsBearing.push(lsb);
      i++;
    }
    this.aWidth = aWidth;
    this.lsBearing = lsBearing;
  }
}
