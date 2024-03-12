import { B } from '../Bin';

export abstract class SubTable {
  abstract format: 0 | 4 | 6 | 12;
}
export class SubTable0 extends SubTable { //   parse0
  format: 0;
  map: number[];
  constructor(data: Uint8Array, offset: number) {
    super();
    this.format = 0;
    let bin = B;
    offset += 2;
    let len = bin.readUshort(data, offset);
    offset += 2;
    let lang = bin.readUshort(data, offset);
    offset += 2;
    this.map = [];
    for (let i = 0; i < len - 6; i++) {
      this.map.push(data[offset + i]);
    }
  }
}
export class SubTable4 extends SubTable { //   parse4
  format: 4;
  searchRange: number;
  entrySelector: number;
  rangeShift: number;
  startCount: number[];
  endCount: number[];
  idDelta: number[];
  idRangeOffset: number[];
  glyphIdArray: number[];
  constructor(data: Uint8Array, offset: number) {
    super();
    this.format = 4;
    const bin = B;
    let offset0 = offset;
    offset += 2;
    let length = bin.readUshort(data, offset);
    offset += 2;
    let language = bin.readUshort(data, offset);
    offset += 2;
    let segCountX2 = bin.readUshort(data, offset);
    offset += 2;
    let segCount = segCountX2 >>> 1;
    this.searchRange = bin.readUshort(data, offset);
    offset += 2;
    this.entrySelector = bin.readUshort(data, offset);
    offset += 2;
    this.rangeShift = bin.readUshort(data, offset);
    offset += 2;
    this.endCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    offset += 2;
    this.startCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    this.idDelta = [];
    for (let i = 0; i < segCount; i++) {
      this.idDelta.push(bin.readShort(data, offset));
      offset += 2;
    }
    this.idRangeOffset = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    this.glyphIdArray = bin.readUshorts(data, offset, ((offset0 + length) - offset) >>> 1);  // offset += segCount*2;
  }
}
export class SubTable6 extends SubTable { //   parse6
  format: 6;
  firstCode: number;
  glyphIdArray: number[];
  constructor(data: Uint8Array, offset: number) {
    super();
    this.format = 6;
    this.firstCode = B.readUshort(data, offset);
    offset += 2;
    let entryCount = B.readUshort(data, offset);
    offset += 2;
    this.glyphIdArray = [];
    for (let i = 0; i < entryCount; i++) {
      this.glyphIdArray.push(B.readUshort(data, offset));
      offset += 2;
    }
  }
}
export class SubTable12 extends SubTable { //   parse12
  format: 12;
  groups?: Uint32Array;
  constructor(data: Uint8Array, offset: number) {
    super();
    this.format = 12;
    let bin = B;
    let offset0 = offset;
    // obj.format = bin.readUshort(data, offset);
    offset += 4;
    let length = bin.readUint(data, offset);
    offset += 4;
    let lang = bin.readUint(data, offset);
    offset += 4;
    let nGroups = bin.readUint(data, offset) * 3;
    offset += 4;
    let gps = this.groups = new Uint32Array(nGroups); // new Uint32Array(data.slice(offset, offset+nGroups*12).buffer);
    for (let i = 0; i < nGroups; i += 3) {
      gps[i] = bin.readUint(data, offset + (i << 2));
      gps[i + 1] = bin.readUint(data, offset + (i << 2) + 4);
      gps[i + 2] = bin.readUint(data, offset + (i << 2) + 8);
    }
  }
}
export class Cmap {
  tables: SubTable[];
  ids: Record<string, number>;
  off: number;
  constructor(data: Uint8Array, offset: number, length: number) {
    const off = offset;
    const tables: SubTable[] = [];
    const ids: Record<string, number> = {};
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    let offset0 = offset;
    let bin = B;
    // let cmap = TypeFont['T'].cmap;
    let version = bin.readUshort(data, offset);
    offset += 2;
    let numTables = bin.readUshort(data, offset);
    offset += 2;
    // console.log(version, numTables);
    let offs = [];
    for (let i = 0; i < numTables; i++) {
      let platformID = bin.readUshort(data, offset);
      offset += 2;
      let encodingID = bin.readUshort(data, offset);
      offset += 2;
      let noffset = bin.readUint(data, offset);
      offset += 4;

      let id = 'p' + platformID + 'e' + encodingID;
      // console.log('cmap subtable ', platformID, encodingID, noffset);

      let tind = offs.indexOf(noffset);

      if (tind === -1) {
        tind = tables.length;
        let subt: SubTable | null = null;
        offs.push(noffset);
        // let time = Date.now();
        let format = bin.readUshort(data, noffset);
        if (format === 0) {
          subt = Cmap.parse0(data, noffset);
        }
        // else if(format== 2) subt.off = noffset;
        else if (format === 4) {
          subt = Cmap.parse4(data, noffset);
        } else if (format === 6) {
          subt = Cmap.parse6(data, noffset);
        } else if (format === 12) {
          subt = Cmap.parse12(data, noffset);
        } else {
          // console.log(format, Date.now()-time);
          console.log('unknown format: ' + format, platformID, encodingID, noffset);
        }
        if (subt) {
          tables.push(subt);
        }
      }
      // console.error('obj.ids[' + id + '] is ', obj.ids[id]); // undefined
      if (ids[id] !== undefined) {
        throw Error('multiple tables for one platform + encoding: ' + id);
      }
      ids[id] = tind;
    }
    this.tables = tables;
    this.ids = ids;
    this.off = off;
  }
  // static parseTab(data: Uint8Array, offset: number, length: number): Cmap {
  //   return new Cmap(data, offset, length);
  // }
  static parse0(data: Uint8Array, offset: number): SubTable0 {
    return new SubTable0(data, offset);
  }
  static parse4(data: Uint8Array, offset: number): SubTable4 {
    return new SubTable4(data, offset);
  }
  static parse6(data: Uint8Array, offset: number): SubTable6 {
    let bin = B;
    let offset0 = offset;
    offset += 2;
    let length = bin.readUshort(data, offset);
    offset += 2;
    let language = bin.readUshort(data, offset);
    offset += 2;
    return new SubTable6(data, offset);
  }
  static parse12(data: Uint8Array, offset: number): SubTable12 {
    return new SubTable12(data, offset);
  }
}
