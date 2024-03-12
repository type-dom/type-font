import { Bin } from '../core';
export class Hmtx {
  public static parse(data: Uint8Array, offset: number, length: number, font: any): any {
    let obj: any = {};
    obj.aWidth = [];
    obj.lsBearing = [];
    let aw = 0;
    let lsb = 0;
    for (let i = 0; i < font.maxp.numGlyphs; i++) {
      if (i < font.hhea.numberOfHMetrics) {
        aw = Bin.readUshort(data, offset);
        offset += 2;
        lsb = Bin.readShort(data, offset);
        offset += 2;
      }
      obj.aWidth.push(aw);
      obj.lsBearing.push(lsb);
    }
    return obj;
  }
}
