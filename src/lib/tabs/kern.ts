import { B } from '../Bin';
// import { ITagFont } from '../type-font.interface';
import { TypeFont } from '../type-font';
export class Kern {
  version: number;
  glyph1: number[];
  rval: { glyph2: number[], vals: number[] }[];
  constructor(data: Uint8Array, offset: number, length: number, font: TypeFont) {
    this.glyph1 = [];
    this.rval = [{
      glyph2: [],
      vals: []
    }];
    let bin = B;
    let version = this.version = bin.readUshort(data, offset);
    if (version === 1) {
      // return Kern.parseV1(data, offset, length, font);
      // let kern = T.kern;
      let version = bin.readFixed(data, offset);   // 0x00010000
      let nTables = bin.readUint(data, offset + 4);
      offset += 8;

      // let map = new Kern(); // { glyph1: [], rval: [] };
      for (let i = 0; i < nTables; i++) {
        let length = bin.readUint(data, offset);
        offset += 4;
        let coverage = bin.readUshort(data, offset);
        offset += 2;
        let tupleIndex = bin.readUshort(data, offset);
        offset += 2;
        let format = coverage & 0xff;
        if (format === 0) {
          offset = this.readFormat(data, offset);
        }
        // else {
        //   throw Error('unknown kern table format: ' + format);
        // }
      }
    } else {
      let nTables = bin.readUshort(data, offset + 2);
      offset += 4;
      // let map = new Kern(); // { glyph1: [], rval: [] };
      for (let i = 0; i < nTables; i++) {
        offset += 2; // skip version
        let length = bin.readUshort(data, offset);
        offset += 2;
        let coverage = bin.readUshort(data, offset);
        offset += 2;
        let format = coverage >>> 8;
        /* I have seen format 128 once, that's why I do */
        format &= 0xf;
        if (format === 0) {
          offset = this.readFormat(data, offset);
        }
        // else throw "unknown kern table format: "+format;
      }
    }
  }
  // static parseTab(data: Uint8Array, offset: number, length: number, font: TypeFont): Kern {
  //   let bin = B;
  //   // let kern = T.kern;
  //
  //   let version = bin.readUshort(data, offset);
  //   if (version === 1) return Kern.parseV1(data, offset, length, font);
  //   let nTables = bin.readUshort(data, offset + 2);
  //   offset += 4;
  //
  //   let map = new Kern(); // { glyph1: [], rval: [] };
  //   for (let i = 0; i < nTables; i++) {
  //     offset += 2; // skip version
  //     let length = bin.readUshort(data, offset);
  //     offset += 2;
  //     let coverage = bin.readUshort(data, offset);
  //     offset += 2;
  //     let format = coverage >>> 8;
  //     /* I have seen format 128 once, that's why I do */
  //     format &= 0xf;
  //     if (format === 0) {
  //       offset = Kern.readFormat0(data, offset, map);
  //     }
  //     // else throw "unknown kern table format: "+format;
  //   }
  //   return map;
  // }
  //
  // static parseV1(data: Uint8Array, offset: number, length?: number, font?: TypeFont): Kern {
  //   let bin = B;
  //   // let kern = T.kern;
  //   let version = bin.readFixed(data, offset);   // 0x00010000
  //   let nTables = bin.readUint(data, offset + 4);
  //   offset += 8;
  //
  //   let map = new Kern(); // { glyph1: [], rval: [] };
  //   for (let i = 0; i < nTables; i++) {
  //     let length = bin.readUint(data, offset);
  //     offset += 4;
  //     let coverage = bin.readUshort(data, offset);
  //     offset += 2;
  //     let tupleIndex = bin.readUshort(data, offset);
  //     offset += 2;
  //     let format = coverage & 0xff;
  //     if (format === 0) {
  //       offset = Kern.readFormat0(data, offset, map);
  //     }
  //     // else {
  //     //   throw Error('unknown kern table format: ' + format);
  //     // }
  //   }
  //   return map;
  // }
  // static readFormat0(data: Uint8Array, offset: number, map: Kern): number {
  //   let bin = B;
  //   let pleft = -1;
  //   let nPairs = bin.readUshort(data, offset);
  //   let searchRange = bin.readUshort(data, offset + 2);
  //   let entrySelector = bin.readUshort(data, offset + 4);
  //   let rangeShift = bin.readUshort(data, offset + 6);
  //   offset += 8;
  //   for (let j = 0; j < nPairs; j++) {
  //     let left = bin.readUshort(data, offset);
  //     offset += 2;
  //     let right = bin.readUshort(data, offset);
  //     offset += 2;
  //     let value = bin.readShort(data, offset);
  //     offset += 2;
  //     if (left !== pleft) {
  //       map.glyph1.push(left);
  //       map.rval.push({ glyph2: [], vals: [] });
  //     }
  //     let rval = map.rval[map.rval.length - 1];
  //     rval.glyph2.push(right);
  //     rval.vals.push(value);
  //     pleft = left;
  //   }
  //   return offset;
  // }
  readFormat(data: Uint8Array, offset: number): number {
    let bin = B;
    let pleft = -1;
    let nPairs = bin.readUshort(data, offset);
    let searchRange = bin.readUshort(data, offset + 2);
    let entrySelector = bin.readUshort(data, offset + 4);
    let rangeShift = bin.readUshort(data, offset + 6);
    offset += 8;
    for (let j = 0; j < nPairs; j++) {
      let left = bin.readUshort(data, offset);
      offset += 2;
      let right = bin.readUshort(data, offset);
      offset += 2;
      let value = bin.readShort(data, offset);
      offset += 2;
      if (left !== pleft) {
        this.glyph1.push(left);
        this.rval.push({ glyph2: [], vals: [] });
      }
      let rval = this.rval[this.rval.length - 1];
      rval.glyph2.push(right);
      rval.vals.push(value);
      pleft = left;
    }
    return offset;
  }
}
