import { B as bin } from '../Bin';

export class CBLC {
  static parseTab(data: Uint8Array, offset: number, length?: number): Array<[number, number, number, number[]]> {
    let ooff = offset;

    let maj = bin.readUshort(data, offset);
    offset += 2;
    let min = bin.readUshort(data, offset);
    offset += 2;

    let numSizes = bin.readUint(data, offset);
    offset += 4;

    let out: Array<[number, number, number, number[]]> = [];
    for (let i = 0; i < numSizes; i++) {
      let off = bin.readUint(data, offset);
      offset += 4;  // indexSubTableArrayOffset
      let siz = bin.readUint(data, offset);
      offset += 4;  // indexTablesSize
      let num = bin.readUint(data, offset);
      offset += 4;  // numberOfIndexSubTables
      offset += 4;

      offset += 2 * 12;

      let sGlyph = bin.readUshort(data, offset);
      offset += 2;
      let eGlyph = bin.readUshort(data, offset);
      offset += 2;

      // console.log(off,siz,num, sGlyph, eGlyph);

      offset += 4;

      let coff = ooff + off;
      for (let j = 0; j < 3; j++) {
        let fgI = bin.readUshort(data, coff);
        coff += 2;
        let lgI = bin.readUshort(data, coff);
        coff += 2;
        let nxt = bin.readUint(data, coff);
        coff += 4;
        let gcnt = lgI - fgI + 1;
        // console.log(fgI, lgI, nxt);   //if(nxt==0) break;

        let ioff = ooff + off + nxt;

        let inF = bin.readUshort(data, ioff);
        ioff += 2;
        if (inF !== 1) throw inF;
        let imF = bin.readUshort(data, ioff);
        ioff += 2;
        let imgo = bin.readUint(data, ioff);
        ioff += 4;

        let oarr = [];
        for (let gi = 0; gi < gcnt; gi++) {
          let sbitO = bin.readUint(data, ioff + gi * 4);
          oarr.push(imgo + sbitO);
          // console.log("--",sbitO);
        }
        out.push([fgI, lgI, imF, oarr]);
      }
    }
    return out;
  }
}
