import { B } from '../Bin';
import { IPathData } from '../type-font.interface';
export interface ISVGTab {
  entries: number[],
  svgs: string[]
}
export class SVG {
  entries: (number | IPathData)[];
  svgs: (string | SVGSVGElement)[];
  constructor(data: Uint8Array, offset: number, length?: number) {
    this.entries = [];
    this.svgs = [];
    let bin = B;
    let offset0 = offset;
    let tableVersion = bin.readUshort(data, offset);
    offset += 2;
    let svgDocIndexOffset = bin.readUint(data, offset);
    offset += 4;
    let reserved = bin.readUint(data, offset);
    offset += 4;
    offset = svgDocIndexOffset + offset0;
    let numEntries = bin.readUshort(data, offset);
    offset += 2;
    for (let i = 0; i < numEntries; i++) {
      let startGlyphID = bin.readUshort(data, offset);
      offset += 2;
      let endGlyphID = bin.readUshort(data, offset);
      offset += 2;
      let svgDocOffset = bin.readUint(data, offset);
      offset += 4;
      let svgDocLength = bin.readUint(data, offset);
      offset += 4;

      let sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength);
      // if (sbuf[0] === 0x1f && sbuf[1] === 0x8b && sbuf[2] === 0x08) {
      // //   sbuf = pako['inflate'](sbuf); // todo pako是压缩库
      // }
      let svg = bin.readUTF8(sbuf, 0, sbuf.length);

      for (let f = startGlyphID; f <= endGlyphID; f++) {
        this.entries[f] = this.svgs.length;
      }
      this.svgs.push(svg);
    }
  }
}
