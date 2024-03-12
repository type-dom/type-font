import { B } from '../Bin';
export class OS2 {
  version: number;
  xAvgCharWidth: number;
  usWeightClass: number;
  usWidthClass: number;
  fsType: number;
  ySubscriptXSize: number;
  ySubscriptYSize: number;
  ySubscriptXOffset: number;
  ySubscriptYOffset: number;
  ySuperscriptXSize: number;
  ySuperscriptYSize: number;
  ySuperscriptXOffset: number;
  ySuperscriptYOffset: number;
  yStrikeoutSize: number;
  yStrikeoutPosition: number;
  sFamilyClass: number;
  panose: number[];
  ulUnicodeRange1: number;
  ulUnicodeRange2: number;
  ulUnicodeRange3: number;
  ulUnicodeRange4: number;
  achVendID: string;
  fsSelection: number;
  usFirstCharIndex: number;
  usLastCharIndex: number;
  sTypoAscender: number;
  sTypoDescender: number;
  sTypoLineGap: number;
  usWinAscent: number;
  usWinDescent: number;
  // v1
  ulCodePageRange1?: number;
  ulCodePageRange2?: number;
  // v2 v3 v4
  sxHeight?: number;
  sCapHeight?: number;
  usDefault?: number;
  usBreak?: number;
  usMaxContext?: number;
  // v5
  usLowerOpticalPointSize?: number;
  usUpperOpticalPointSize?: number;
  constructor(data: Uint8Array, offset: number, length?: number) {
    let bin = B;
    let ver = bin.readUshort(data, offset);
    this.version = ver;
    offset += 2;
    // let obj = {} as IOS2V0Obj | IOS2V1Obj | IOS2V2Obj;
    this.xAvgCharWidth = bin.readShort(data, offset);
    offset += 2;
    this.usWeightClass = bin.readUshort(data, offset);
    offset += 2;
    this.usWidthClass = bin.readUshort(data, offset);
    offset += 2;
    this.fsType = bin.readUshort(data, offset);
    offset += 2;
    this.ySubscriptXSize = bin.readShort(data, offset);
    offset += 2;
    this.ySubscriptYSize = bin.readShort(data, offset);
    offset += 2;
    this.ySubscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    this.ySubscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    this.ySuperscriptXSize = bin.readShort(data, offset);
    offset += 2;
    this.ySuperscriptYSize = bin.readShort(data, offset);
    offset += 2;
    this.ySuperscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    this.ySuperscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    this.yStrikeoutSize = bin.readShort(data, offset);
    offset += 2;
    this.yStrikeoutPosition = bin.readShort(data, offset);
    offset += 2;
    this.sFamilyClass = bin.readShort(data, offset);
    offset += 2;
    this.panose = bin.readBytes(data, offset, 10);
    offset += 10;
    this.ulUnicodeRange1 = bin.readUint(data, offset);
    offset += 4;
    this.ulUnicodeRange2 = bin.readUint(data, offset);
    offset += 4;
    this.ulUnicodeRange3 = bin.readUint(data, offset);
    offset += 4;
    this.ulUnicodeRange4 = bin.readUint(data, offset);
    offset += 4;
    this.achVendID = bin.readASCII(data, offset, 4);
    offset += 4;
    this.fsSelection = bin.readUshort(data, offset);
    offset += 2;
    this.usFirstCharIndex = bin.readUshort(data, offset);
    offset += 2;
    this.usLastCharIndex = bin.readUshort(data, offset);
    offset += 2;
    this.sTypoAscender = bin.readShort(data, offset);
    offset += 2;
    this.sTypoDescender = bin.readShort(data, offset);
    offset += 2;
    this.sTypoLineGap = bin.readShort(data, offset);
    offset += 2;
    this.usWinAscent = bin.readUshort(data, offset);
    offset += 2;
    this.usWinDescent = bin.readUshort(data, offset);
    offset += 2;
    if (ver > 0) {
      this.ulCodePageRange1 = bin.readUint(data, offset);
      offset += 4;
      this.ulCodePageRange2 = bin.readUint(data, offset);
      offset += 4;
    }
    if (ver > 1) {
      this.sxHeight = bin.readShort(data, offset);
      offset += 2;
      this.sCapHeight = bin.readShort(data, offset);
      offset += 2;
      this.usDefault = bin.readUshort(data, offset);
      offset += 2;
      this.usBreak = bin.readUshort(data, offset);
      offset += 2;
      this.usMaxContext = bin.readUshort(data, offset);
      offset += 2;
    }
    if (ver > 4) {
      this.usLowerOpticalPointSize = B.readUshort(data, offset);
      offset += 2;
      this.usUpperOpticalPointSize = B.readUshort(data, offset);
      offset += 2;
    }
    if (ver > 5) {
      throw Error('unknown OS/2 table version: ' + ver);
    }
  }
}
