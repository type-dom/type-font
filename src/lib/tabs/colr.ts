import { B } from '../Bin';

export class Colr {
  static parseTab(data: Uint8Array, offset: number, length?: number): [Record<string, [number, number]>, number[]] {
    let bin = B;
    let ooff = offset;
    offset += 2;
    let num = bin.readUshort(data, offset);
    offset += 2;

    let boff = bin.readUint(data, offset);
    offset += 4;
    let loff = bin.readUint(data, offset);
    offset += 4;

    let lnum = bin.readUshort(data, offset);
    offset += 2;
    // console.log(num,boff,loff,lnum);

    let base: Record<string, [number, number]> = {};
    let coff = ooff + boff;
    for (let i = 0; i < num; i++) {
      base['g' + bin.readUshort(data, coff)] = [bin.readUshort(data, coff + 2), bin.readUshort(data, coff + 4)];
      coff += 6;
    }

    let lays = [];
    coff = ooff + loff;
    for (let i = 0; i < lnum; i++) {
      lays.push(bin.readUshort(data, coff), bin.readUshort(data, coff + 2));
      coff += 4;
    }
    return [base, lays];
  }
}
