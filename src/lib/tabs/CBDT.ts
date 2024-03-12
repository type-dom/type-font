export class CBDT {
  static parseTab(data: Uint8Array, offset: number, length: number): Uint8Array {
    // let ooff = offset;
    // let maj = bin.readUshort(data,offset);  offset+=2;
    // let min = bin.readUshort(data,offset);  offset+=2;
    return new Uint8Array(data.buffer, data.byteOffset + offset, length);
  }
}
