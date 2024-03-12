import { B as bin } from '../Bin';
// import { ITagFont } from '../type-font.interface';
import { TypeFont } from '../type-font';
export class Loca {
  static parseTab(data: Uint8Array, offset: number, length: number, font: TypeFont): number[] {
    let obj = [];
    let ver = font.head?.indexToLocFormat;
    let len = font.maxp!.numGlyphs! + 1;
    if (ver === 0) {
      for (let i = 0; i < len; i++) {
        obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
      }
    }
    if (ver === 1) {
      for (let i = 0; i < len; i++) {
        obj.push(bin.readUint(data, offset + (i << 2)));
      }
    }
    return obj;
  }
}
