import { B } from '../Bin';
import { TypeFont } from '../type-font';

export class Sbix {
  static parseTab(data: Uint8Array, offset: number, length: number, obj: TypeFont): (Uint8Array | null)[] {
    let numGlyphs = obj.maxp!.numGlyphs!;
    let ooff = offset;
    let bin = B;

    // let ver = bin.readUshort(data, offset);  offset+=2;
    // let flg = bin.readUshort(data, offset);  offset+=2;

    let numStrikes = bin.readUint(data, offset + 4);

    let out: (Uint8Array | null)[] = [];
    for (let si = numStrikes - 1; si < numStrikes; si++) {
      let off = ooff + bin.readUint(data, offset + 8 + si * 4);

      // let ppem = bin.readUshort(data,off);  off+=2;
      // let ppi  = bin.readUshort(data,off);  off+=2;

      for (let gi = 0; gi < numGlyphs; gi++) {
        let aoff = bin.readUint(data, off + 4 + gi * 4);
        let noff = bin.readUint(data, off + 4 + gi * 4 + 4);
        if (aoff === noff) {
          out[gi] = null;
          continue;
        }
        let go = off + aoff;
        // let ooX = bin.readUshort(data,go);
        // let ooY = bin.readUshort(data,go+2);
        let tag = bin.readASCII(data, go + 4, 4);
        if (tag !== 'png ') throw tag;

        out[gi] = new Uint8Array(data.buffer, data.byteOffset + go + 8, noff - aoff - 8);
      }
    }
    return out;
  }
}
