import { TextDecoder } from 'text-encoding';
export class B {
  static _tdec = window['TextDecoder'] ? new window['TextDecoder']() : new TextDecoder();
  public static buff: ArrayBuffer = new ArrayBuffer(8);
  static t = {
    // let ab = new ArrayBuffer(8);
    buff: B.buff,
    int8: new Int8Array(B.buff),
    uint8: new Uint8Array(B.buff),
    int16: new Int16Array(B.buff),
    uint16: new Uint16Array(B.buff),
    int32: new Int32Array(B.buff),
    uint32: new Uint32Array(B.buff)
  };
  static readFixed(data: Uint8Array, o: number): number {
    return ((data[o] << 8) | data[o + 1]) + (((data[o + 2] << 8) | data[o + 3]) / (256 * 256 + 4));
  }
  static readF2dot14(data: Uint8Array, o: number): number {
    const num = B.readShort(data, o);
    return num / 16384;
  }
  static readInt(buff: Uint8Array, p: number): number {
    // if(p>=buff.length) throw "error";
    const a = B.t.uint8;
    a[0] = buff[p + 3];
    a[1] = buff[p + 2];
    a[2] = buff[p + 1];
    a[3] = buff[p];
    return B.t.int32[0];
  }
  static readInt8(buff: Uint8Array, p: number): number {
    // if(p>=buff.length) throw "error";
    const a = B.t.uint8;
    a[0] = buff[p];
    return B.t.int8[0];
  }
  static readShort(buff: Uint8Array, p: number): number {
    // if(p>=buff.length) throw "error";
    const a = B.t.uint16;
    a[0] = (buff[p] << 8) | buff[p + 1];
    return B.t.int16[0];
  }
  static readUshort(buff: Uint8Array, p: number): number {
    // if(p>=buff.length) throw "error";
    return (buff[p] << 8) | buff[p + 1];
  }
  static writeUshort(buff: Uint8Array, p: number, n: number): void {
    buff[p] = (n >> 8) & 255;
    buff[p + 1] = n & 255;
  }
  static readUshorts(buff: Uint8Array, p: number, len: number): number[] {
    const arr = [];
    for (let i = 0; i < len; i++) {
      const v = B.readUshort(buff, p + i * 2);  // if(v==932) console.log(p+i*2);
      arr.push(v);
    }
    return arr;
  }
  static readUint(buff: Uint8Array, p: number): number {
    // if(p>=buff.length) throw "error";
    const a = B.t.uint8;
    a[3] = buff[p];
    a[2] = buff[p + 1];
    a[1] = buff[p + 2];
    a[0] = buff[p + 3];
    return B.t.uint32[0];
  }
  static writeUint(buff: Uint8Array, p: number, n: number): void {
    buff[p] = (n >> 24) & 255;
    buff[p + 1] = (n >> 16) & 255;
    buff[p + 2] = (n >> 8) & 255;
    buff[p + 3] = (n >> 0) & 255;
  }
  static readUint64(buff: Uint8Array, p: number): number {
    // if(p>=buff.length) throw "error";
    return (B.readUint(buff, p) * (0xffffffff + 1)) + B.readUint(buff, p + 4);
  }
  // l : length in Characters (not Bytes)
  static readASCII(buff: Uint8Array, p: number, l: number): string {
    // if(p>=buff.length) throw "error";
    let s = '';
    for (let i = 0; i < l; i++) s += String.fromCharCode(buff[p + i]);
    return s;
  }
  static writeASCII(buff: Uint8Array, p: number, s: string): void {
    // l : length in Characters (not Bytes)
    for (let i = 0; i < s.length; i++) buff[p + i] = s.charCodeAt(i);
  }
  static readUnicode(buff: Uint8Array, p: number, l: number): string {
    // if(p>=buff.length) throw "error";
    let s = '';
    for (let i = 0; i < l; i++) {
      const c = (buff[p++] << 8) | buff[p++];
      s += String.fromCharCode(c);
    }
    return s;
  }
  static readUTF8(buff: Uint8Array, p: number, len: number): string {
    const tdec = B._tdec;
    if (tdec && p === 0 && len === buff.length) return tdec['decode'](buff);
    return B.readASCII(buff, p, len);
  }
  static readBytes(buff: Uint8Array, p: number, len: number): number[] {
    // if(p>=buff.length) throw "error";
    const arr = [];
    for (let i = 0; i < len; i++) arr.push(buff[p + i]);
    return arr;
  }
  static readASCIIArray(buff: Uint8Array, p: number, l: number): string[] {
    // l : length in Characters (not Bytes)
    // if(p>=buff.length) throw "error";
    const s = [];
    for (let i = 0; i < l; i++) s.push(String.fromCharCode(buff[p + i]));
    return s;
  }
}
