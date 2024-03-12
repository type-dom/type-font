import { B } from '../Bin';
import { ICFFDict, ICFFTab, ISize } from '../type-font.interface';
const tableSE = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  1, 2, 3, 4, 5, 6, 7, 8,
  9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24,
  25, 26, 27, 28, 29, 30, 31, 32,
  33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48,
  49, 50, 51, 52, 53, 54, 55, 56,
  57, 58, 59, 60, 61, 62, 63, 64,
  65, 66, 67, 68, 69, 70, 71, 72,
  73, 74, 75, 76, 77, 78, 79, 80,
  81, 82, 83, 84, 85, 86, 87, 88,
  89, 90, 91, 92, 93, 94, 95, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 96, 97, 98, 99, 100, 101, 102,
  103, 104, 105, 106, 107, 108, 109, 110,
  0, 111, 112, 113, 114, 0, 115, 116,
  117, 118, 119, 120, 121, 122, 0, 123,
  0, 124, 125, 126, 127, 128, 129, 130,
  131, 0, 132, 133, 0, 134, 135, 136,
  137, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 138, 0, 139, 0, 0, 0, 0,
  140, 141, 142, 143, 0, 0, 0, 0,
  0, 144, 0, 0, 0, 145, 0, 0,
  146, 147, 148, 149, 0, 0, 0, 0
];
export class CFF {
  ROS?: number;
  Bias?: number;
  CharStrings?: Uint8Array[];
  Encoding?: [string, ...number[]];
  FontBBox?: [number, number, number, number];
  FontMatrix?: [number, number, number, number, number, number];
  FullName?: string;
  ItalicAngle?: number;
  Notice?: string;
  PaintType?: number;
  Private?: ICFFTab;
  StrokeWidth?: number;
  Subrs?: Uint8Array[];
  UnderlinePosition?: number;
  UnderlineThickness?: number;
  charset?: [string, ...number[]];
  version?: string;
  FDSelect?: number[];
  FDArray?: ICFFTab[];
  defaultWidthX?: number;
  nominalWidthX?: number;
  constructor(data: Uint8Array, offset: number, length: number) {
    let bin = B;
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    // Header
    let major = data[offset];
    offset++;
    let minor = data[offset];
    offset++;
    let hdrSize = data[offset];
    offset++;
    let offsize = data[offset];
    offset++;
    // console.log(major, minor, hdrSize, offsize);
    // Name INDEX
    let ninds: number[] = [];
    offset = CFF.readIndex(data, offset, ninds); // todo Error: unsupported offset size: 0, count: 12
    const names: string[] = [];
    for (let i = 0; i < ninds.length - 1; i++) {
      names.push(bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]));
    }
    offset += ninds[ninds.length - 1];
    // Top DICT INDEX
    let tdinds: number[] = [];
    // console.log(tdinds);
    offset = CFF.readIndex(data, offset, tdinds);
    // Top DICT Data
    let topDicts = [];
    for (let i = 0; i < tdinds.length - 1; i++) {
      topDicts.push(CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1]));
    }
    offset += tdinds[tdinds.length - 1];
    let topdict = topDicts[0];
    // console.error('topdict is ', topdict);

    // String INDEX
    let sinds: number[] = [];
    offset = CFF.readIndex(data, offset, sinds);
    // String Data
    let strings = [];
    for (let i = 0; i < sinds.length - 1; i++) {
      strings.push(bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
    }
    offset += sinds[sinds.length - 1];

    // Global Subr INDEX  (subroutines)
    this.Subrs = CFF.readBytes(data, offset);
    let bias;
    let nSubrs = this.Subrs.length + 1;
    if (false) {
      bias = 0;
    } else if (nSubrs < 1240) {
      bias = 107;
    } else if (nSubrs < 33900) {
      bias = 1131;
    } else {
      bias = 32768;
    }
    this.Bias = bias;

    // charstrings
    if (topdict.CharStrings) {
      // (topdict as ICFFTab)['CharStrings'] = CFF.readBytes(data, topdict['CharStrings'] as number);
      this.CharStrings = CFF.readBytes(data, topdict.CharStrings);
    }

    // CID font
    if (topdict.ROS) {
      offset = topdict.FDArray;
      let fdind: number[] = [];
      offset = CFF.readIndex(data, offset, fdind);

      this.FDArray = [];
      for (let i = 0; i < fdind.length - 1; i++) {
        let dict = CFF.readDict(data, offset + fdind[i], offset + fdind[i + 1]);
        const tab = this._readFDict(data, dict, strings);
        this.FDArray.push(tab);
      }
      offset += fdind[fdind.length - 1];

      offset = topdict.FDSelect;
      this.FDSelect = [];
      let fmt = data[offset];
      offset++;
      if (fmt === 3) {
        let rns = bin.readUshort(data, offset);
        offset += 2;
        for (let i = 0; i < rns + 1; i++) {
          this.FDSelect.push(bin.readUshort(data, offset), data[offset + 2]);
          offset += 3;
        }
      } else {
        throw fmt;
      }
    }

    // Encoding
    if (topdict.Encoding) {
      this.Encoding = CFF.readEncoding(data, topdict.Encoding, this.CharStrings?.length);
    }

    // charset
    if (topdict.charset) {
      this.charset = CFF.readCharset(data, topdict.charset, this.CharStrings!.length);
    }
    // Private:(2) [9, 13114]
    if (topdict.Private) {
      offset = topdict.Private[1];
      const Private = CFF.readDict(data, offset, offset + topdict.Private[0]);
      this.Private = CFF.readSubrs(data, offset + Private.Subrs, Private);
    }
    for (const p in topdict) {
      if (['FamilyName', 'FontName', 'FullName', 'Notice', 'version', 'Copyright'].indexOf(p) !== -1) {
        (this as any)[p] = strings[Number(topdict[p]) - 426 + 35];
      }
    }
    // console.error('topdict is ', topdict);
    // CharStrings:445
    this.FontBBox = topdict.FontBBox;
    this.FontMatrix = topdict.FontMatrix;
    this.ItalicAngle = topdict.ItalicAngle;
    this.PaintType = topdict.PaintType;
    this.StrokeWidth = topdict.StrokeWidth;
    this.UnderlinePosition = topdict.UnderlinePosition;
    this.UnderlineThickness = topdict.UnderlineThickness;
    // charset:384
    // this.Private = topdict.Private;
    // return Object.assign(topdict, topTab) as ICFFTab;
  }
  static parseTab(data: Uint8Array, offset: number, length: number): CFF {
    return new CFF(data, offset, length);
    // let bin = B;
    // data = new Uint8Array(data.buffer, offset, length);
    // offset = 0;
    // // Header
    // let major = data[offset];
    // offset++;
    // let minor = data[offset];
    // offset++;
    // let hdrSize = data[offset];
    // offset++;
    // let offsize = data[offset];
    // offset++;
    // // console.log(major, minor, hdrSize, offsize);
    // // Name INDEX
    // let ninds: number[] = [];
    // offset = CFF.readIndex(data, offset, ninds); // todo Error: unsupported offset size: 0, count: 12
    // const names: string[] = [];
    // for (let i = 0; i < ninds.length - 1; i++) {
    //   names.push(bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]));
    // }
    // offset += ninds[ninds.length - 1];
    // // Top DICT INDEX
    // let tdinds: number[] = [];
    // // console.log(tdinds);
    // offset = CFF.readIndex(data, offset, tdinds);
    // // Top DICT Data
    // let topDicts = [];
    // for (let i = 0; i < tdinds.length - 1; i++) {
    //   topDicts.push(CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1]));
    // }
    // offset += tdinds[tdinds.length - 1];
    // let topdict = topDicts[0];
    // // console.log(topdict);
    // const topTab = {} as ICFFTab; // new CFF(); //
    // // String INDEX
    // let sinds: number[] = [];
    // offset = CFF.readIndex(data, offset, sinds);
    // // String Data
    // let strings = [];
    // for (let i = 0; i < sinds.length - 1; i++) {
    //   strings.push(bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
    // }
    // offset += sinds[sinds.length - 1];
    //
    // // Global Subr INDEX  (subroutines)
    // CFF.readSubrs(data, offset, topdict);
    //
    // // charstrings
    // if (topdict.CharStrings) {
    //   // (topdict as ICFFTab)['CharStrings'] = CFF.readBytes(data, topdict['CharStrings'] as number);
    //   topTab.CharStrings = CFF.readBytes(data, topdict.CharStrings);
    // }
    //
    // // CID font
    // if (topdict.ROS) {
    //   offset = topdict.FDArray;
    //   let fdind: number[] = [];
    //   offset = CFF.readIndex(data, offset, fdind);
    //
    //   topTab.FDArray = [];
    //   for (let i = 0; i < fdind.length - 1; i++) {
    //     let dict = CFF.readDict(data, offset + fdind[i], offset + fdind[i + 1]);
    //     CFF._readFDict(data, dict, strings);
    //     topTab.FDArray.push(dict);
    //   }
    //   offset += fdind[fdind.length - 1];
    //
    //   offset = topdict.FDSelect;
    //   topTab.FDSelect = [];
    //   let fmt = data[offset];
    //   offset++;
    //   if (fmt === 3) {
    //     let rns = bin.readUshort(data, offset);
    //     offset += 2;
    //     for (let i = 0; i < rns + 1; i++) {
    //       topTab.FDSelect.push(bin.readUshort(data, offset), data[offset + 2]);
    //       offset += 3;
    //     }
    //   } else {
    //     throw fmt;
    //   }
    // }
    //
    // // Encoding
    // // if(topdict["Encoding"]) topdict["Encoding"] = CFF.readEncoding(data, topdict["Encoding"], topdict["CharStrings"].length);
    //
    // // charset
    // if (topdict.charset) topTab.charset = CFF.readCharset(data, topdict.charset, topTab.CharStrings!.length);
    //
    // CFF._readFDict(data, Object.assign(topdict, topTab), strings);
    // return Object.assign(topdict, topTab) as ICFFTab;
  }

  _readFDict(data: Uint8Array, dict: ICFFDict, ss: string[]): ICFFTab {
    let offset;
    const obj = {} as ICFFTab;
    if (dict.Private[1]) {
      offset = dict.Private[1];
      const Private = CFF.readDict(data, offset, offset + dict.Private[0]);
      obj.Private = CFF.readSubrs(data, offset + Private.Subrs, Private);
    }
    for (let p in dict) {
      if (['FamilyName', 'FontName', 'FullName', 'Notice', 'version', 'Copyright'].indexOf(p) !== -1) {
        dict[p] = ss[Number(dict[p]) - 426 + 35];
      }
    }
    return Object.assign(dict, obj);
  }

  static readSubrs(data: Uint8Array, offset: number, dict: ICFFDict): ICFFTab {
    const obj = {} as ICFFTab;
    obj.Subrs = CFF.readBytes(data, offset);
    let bias;
    let nSubrs = obj.Subrs.length + 1;
    if (false) {
      bias = 0;
    } else if (nSubrs < 1240) {
      bias = 107;
    } else if (nSubrs < 33900) {
      bias = 1131;
    } else {
      bias = 32768;
    }
    obj.Bias = bias;
    return Object.assign(dict, obj);
  }
  static readBytes(data: Uint8Array, offset: number): Uint8Array[] {
    let arr: number[] = [];
    offset = CFF.readIndex(data, offset, arr);
    let subrs = [];
    let arl = arr.length - 1;
    let no = data.byteOffset + offset;
    for (let i = 0; i < arl; i++) {
      let ari = arr[i];
      subrs.push(new Uint8Array(data.buffer, no + ari, arr[i + 1] - ari));
    }
    return subrs;
  }
  static glyphByUnicode(cff: CFF, code: string | number): number {
    for (let i = 0; i < cff.charset!.length; i++) {
      console.log('cff.charset[' + i + '] is ', cff.charset![i], ' code is ', code);
      console.error('cff.charset[i] === code is ', cff.charset![i] === code);
      if (cff.charset![i] === code) return i;
    }
    return -1;
  }
  static glyphBySE(cff: CFF, charcode: number): number {
    // glyph by standard encoding
    if (charcode < 0 || charcode > 255) return -1;
    return CFF.glyphByUnicode(cff, tableSE[charcode]);
  }
  static readEncoding(data: Uint8Array, offset: number, num?: number): [string, ...number[]] {
    let array: [string, ...number[]] = ['.notdef'];
    let format = data[offset];
    offset++;

    if (format === 0) {
      let nCodes = data[offset];
      offset++;
      for (let i = 0; i < nCodes; i++) {
        array.push(data[offset + i]);
      }
    } else {
      throw Error('error: unknown encoding format: ' + format);
    }
    return array;
  }
  static readCharset(data: Uint8Array, offset: number, num: number): [string, ...number[]] {
    let bin = B;
    let charset: [string, ...number[]] = ['.notdef'];
    let format = data[offset];
    offset++;
    if (format === 0) {
      for (let i = 0; i < num; i++) {
        let first = bin.readUshort(data, offset);
        offset += 2;
        charset.push(first);
      }
    } else if (format === 1 || format === 2) {
      while (charset.length < num) {
        let first = bin.readUshort(data, offset);
        offset += 2;
        let nLeft = 0;
        if (format === 1) {
          nLeft = data[offset];
          offset++;
        } else {
          nLeft = bin.readUshort(data, offset);
          offset += 2;
        }
        for (let i = 0; i <= nLeft; i++) {
          charset.push(first);
          first++;
        }
      }
    } else {
      throw Error('error: format: ' + format);
    }
    return charset;
  }
  static readIndex(data: Uint8Array, offset: number, inds: number[]): number {
    let bin = B;
    let count = bin.readUshort(data, offset) + 1;
    offset += 2;
    let offsize = data[offset];
    offset++;
    if (offsize === 1) {
      for (let i = 0; i < count; i++) inds.push(data[offset + i]);
    }
    else if (offsize === 2) {
      for (let i = 0; i < count; i++) inds.push(bin.readUshort(data, offset + i * 2));
    }
    else if (offsize === 3) {
      for (let i = 0; i < count; i++) inds.push(bin.readUint(data, offset + i * 3 - 1) & 0x00ffffff);
    }
    else if (offsize === 4) {
      for (let i = 0; i < count; i++) inds.push(bin.readUint(data, offset + i * 4));
    }
    else if (count !== 1) {
      throw Error('unsupported offset size: ' + offsize + ', count: ' + count);
    }
    offset += count * offsize;
    return offset - 1;
  }

  static getCharString(data: Uint8Array, offset: number, o: ISize): void {
    let bin = B;
    let b0 = data[offset];
    let b1 = data[offset + 1];
    let b2 = data[offset + 2];
    let b3 = data[offset + 3];
    let b4 = data[offset + 4];
    let vs = 1;
    let op = null;
    let val = null;
    // operand
    if (b0 <= 20) {
      op = b0;
      vs = 1;
    }
    if (b0 === 12) {
      op = b0 * 100 + b1;
      vs = 2;
    }
    // if(b0==19 || b0==20) { op = b0/*+" "+b1*/;  vs=2; }
    if (21 <= b0 && b0 <= 27) {
      op = b0;
      vs = 1;
    }
    if (b0 === 28) {
      val = bin.readShort(data, offset + 1);
      vs = 3;
    }
    if (29 <= b0 && b0 <= 31) {
      op = b0;
      vs = 1;
    }
    if (32 <= b0 && b0 <= 246) {
      val = b0 - 139;
      vs = 1;
    }
    if (247 <= b0 && b0 <= 250) {
      val = (b0 - 247) * 256 + b1 + 108;
      vs = 2;
    }
    if (251 <= b0 && b0 <= 254) {
      val = -(b0 - 251) * 256 - b1 - 108;
      vs = 2;
    }
    if (b0 === 255) {
      val = bin.readInt(data, offset + 1) / 0xffff;
      vs = 5;
    }
    // console.error('== null val is ', val); // null is right
    o.val = val !== null ? val : 'o' + op;
    o.size = vs;
  }

  static readCharString(data: Uint8Array, offset: number, length: number): (string | number)[] {
    let end = offset + length;
    let bin = B;
    let arr = [];
    while (offset < end) {
      let b0 = data[offset];
      let b1 = data[offset + 1];
      let b2 = data[offset + 2];
      let b3 = data[offset + 3];
      let b4 = data[offset + 4];
      let vs = 1;
      let op = null;
      let val = null;
      // operand
      if (b0 <= 20) {
        op = b0;
        vs = 1;
      }
      if (b0 === 12) {
        op = b0 * 100 + b1;
        vs = 2;
      }
      if (b0 === 19 || b0 === 20) {
        op = b0/* +" "+b1 */;
        vs = 2;
      }
      if (21 <= b0 && b0 <= 27) {
        op = b0;
        vs = 1;
      }
      if (b0 === 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (29 <= b0 && b0 <= 31) {
        op = b0;
        vs = 1;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 === 255) {
        val = bin.readInt(data, offset + 1) / 0xffff;
        vs = 5;
      }
      console.error('== null val is ', val);
      arr.push(val !== null ? val : 'o' + op);
      offset += vs;
      // let cv = arr[arr.length-1];
      // if(cv==undefined) throw "error";
      // console.log()
    }
    return arr;
  }
  static readDict(data: Uint8Array, offset: number, end: number): ICFFDict {
    let bin = B;
    // let dict = [];
    let dict = {} as ICFFDict;
    let carr = [];
    while (offset < end) {
      let b0 = data[offset];
      let b1 = data[offset + 1];
      let b2 = data[offset + 2];
      let b3 = data[offset + 3];
      let b4 = data[offset + 4];
      let vs = 1;
      let key = null;
      let val = null;
      // operand
      if (b0 === 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (b0 === 29) {
        val = bin.readInt(data, offset + 1);
        vs = 5;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 === 255) {
        val = bin.readInt(data, offset + 1) / 0xffff;
        vs = 5;
        throw Error('unknown number');
      }
      if (b0 === 30) {
        let nibs = [];
        vs = 1;
        while (true) {
          let b = data[offset + vs];
          vs++;
          let nib0 = b >> 4;
          let nib1 = b & 0xf;
          if (nib0 !== 0xf) nibs.push(nib0);
          if (nib1 !== 0xf) nibs.push(nib1);
          if (nib1 === 0xf) break;
        }
        let s = '';
        let chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 'e', 'e-', 'reserved', '-', 'endOfNumber'];
        for (let i = 0; i < nibs.length; i++) s += chars[nibs[i]];
        // console.log(nibs);
        val = parseFloat(s);
      }

      if (b0 <= 21) { // operator
        const keys = ['version', 'Notice', 'FullName', 'FamilyName', 'Weight', 'FontBBox', 'BlueValues', 'OtherBlues', 'FamilyBlues', 'FamilyOtherBlues',
          'StdHW', 'StdVW', 'escape', 'UniqueID', 'XUID', 'charset', 'Encoding', 'CharStrings', 'Private', 'Subrs',
          'defaultWidthX', 'nominalWidthX'];

        key = keys[b0];
        vs = 1;
        if (b0 === 12) {
          const keys = ['Copyright', 'isFixedPitch', 'ItalicAngle', 'UnderlinePosition', 'UnderlineThickness', 'PaintType', 'CharstringType', 'FontMatrix', 'StrokeWidth', 'BlueScale',
            'BlueShift', 'BlueFuzz', 'StemSnapH', 'StemSnapV', 'ForceBold', '', '', 'LanguageGroup', 'ExpansionFactor', 'initialRandomSeed',
            'SyntheticBase', 'PostScript', 'BaseFontName', 'BaseFontBlend', '', '', '', '', '', '',
            'ROS', 'CIDFontVersion', 'CIDFontRevision', 'CIDFontType', 'CIDCount', 'UIDBase', 'FDArray', 'FDSelect', 'FontName'];
          key = keys[b1];
          vs = 2;
        }
      }
      // console.error('==null key is ', key); // null is right
      if (key !== null) {
        (dict as any)[key] = carr.length === 1 ? carr[0] : carr;
        carr = [];
      } else {
        carr.push(val);
      }
      offset += vs;
    }
    return dict;
  }
}
