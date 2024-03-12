import { B } from '../Bin';

export class Cpal {

  static parseTab(data: Uint8Array, offset: number, length?: number): Uint8Array {
    let bin = B;
    let ooff = offset;
    let vsn = bin.readUshort(data, offset);
    offset += 2;

    if (vsn === 0) {
      let ets = bin.readUshort(data, offset);
      offset += 2;
      let pts = bin.readUshort(data, offset);
      offset += 2;
      let tot = bin.readUshort(data, offset);
      offset += 2;

      let fst = bin.readUint(data, offset);
      offset += 4;

      return new Uint8Array(data.buffer, ooff + fst, tot * 4);
      // /*
      // let coff=ooff+fst;
      //
      // for(let i=0; i<tot; i++) {
      //   console.log(data[coff],data[coff+1],data[coff+2],data[coff+3]);
      //   coff+=4;
      // }
      //
      // console.log(ets,pts,tot); */
    } else {
      throw vsn;
    }// console.log("unknown color palette",vsn);
  }
}
