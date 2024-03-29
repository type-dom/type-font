import { TextDecoder } from 'text-encoding';

export class Bin {
  public static _tdec: TextDecoder = new TextDecoder();
  public static buff: ArrayBuffer = new ArrayBuffer(8);
  public static t = {
    buff: Bin.buff,
    int8: new Int8Array(Bin.buff),
    uint8: new Uint8Array(Bin.buff),
    int16: new Int16Array(Bin.buff),
    uint16: new Uint16Array(Bin.buff),
    int32: new Int32Array(Bin.buff),
    uint32: new Uint32Array(Bin.buff)
  };

  public static readFixed(data: Uint8Array, o: number): number {
    return ((data[o] << 8) | data[o + 1]) + (((data[o + 2] << 8) | data[o + 3]) / (256 * 256 + 4));
  }

  public static readF2dot14(data: Uint8Array, o: number): number {
    const num = Bin.readShort(data, o);
    return num / 16384;
  }

  public static readInt(buff: Uint8Array, p: number): number {
    const a = Bin.t.uint8;
    a[0] = buff[p + 3];
    a[1] = buff[p + 2];
    a[2] = buff[p + 1];
    a[3] = buff[p];
    return Bin.t.int32[0];
  }

  public static readInt8(buff: Uint8Array, p: number): number {
    const a = Bin.t.uint8;
    a[0] = buff[p];
    return Bin.t.int8[0];
  }

  public static readShort(buff: Uint8Array, p: number): number {
    const a = Bin.t.uint8;
    a[1] = buff[p];
    a[0] = buff[p + 1];
    return Bin.t.int16[0];
  }

  public static readUshort(buff: Uint8Array, p: number): number {
    return (buff[p] << 8) | buff[p + 1];
  }

  public static readUshorts(buff: Uint8Array, p: number, len: number): number[] {
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(Bin.readUshort(buff, p + i * 2));
    }
    return arr;
  }

  public static readUint(buff: Uint8Array, p: number): number {
    const a = Bin.t.uint8;
    a[3] = buff[p];
    a[2] = buff[p + 1];
    a[1] = buff[p + 2];
    a[0] = buff[p + 3];
    return Bin.t.uint32[0];
  }

  public static readUint64(buff: Uint8Array, p: number): number {
    return (Bin.readUint(buff, p) * (0xffffffff + 1)) + Bin.readUint(buff, p + 4);
  }

  public static readASCII(buff: Uint8Array, p: number, l: number): string {
    let s = '';
    for (let i = 0; i < l; i++) {
      s += String.fromCharCode(buff[p + i]);
    }
    return s;
  }

  public static readUnicode(buff: Uint8Array, p: number, l: number): string {
    let s = '';
    for (let i = 0; i < l; i++) {
      const c = (buff[p++] << 8) | buff[p++];
      s += String.fromCharCode(c);
    }
    return s;
  }

  public static readUTF8(buff: Uint8Array, p: number, l: number): string {
    const tdec = Bin._tdec;
    if (tdec && p === 0 && l === buff.length) {
      return tdec['decode'](buff);
    }
    return Bin.readASCII(buff, p, l);
  }

  public static readBytes(buff: Uint8Array, p: number, l: number): number[] {
    const arr = [];
    for (let i = 0; i < l; i++) {
      arr.push(buff[p + i]);
    }
    return arr;
  }

  public static readASCIIArray(buff: Uint8Array, p: number, l: number): string[] {
    const s = [];
    for (let i = 0; i < l; i++) {
      s.push(String.fromCharCode(buff[p + i]));
    }
    return s;
  }
}
