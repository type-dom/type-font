import { B } from '../Bin';
export class Maxp {
  version: number;
  numGlyphs: number;
  constructor(data: Uint8Array, offset: number, length?: number) {
    let bin = B;
    // both versions 0.5 and 1.0
    this.version = bin.readUint(data, offset);
    offset += 4;
    // obj.numGlyphs = bin.readUshort(data, offset);
    this.numGlyphs = B.readUshort(data, offset);
    offset += 2;
    // only 1.0
    /*
    if(ver === 0x00010000) {
      obj.maxPoints             = rU(data, offset);  offset += 2;
      obj.maxContours           = rU(data, offset);  offset += 2;
      obj.maxCompositePoints    = rU(data, offset);  offset += 2;
      obj.maxCompositeContours  = rU(data, offset);  offset += 2;
      obj.maxZones              = rU(data, offset);  offset += 2;
      obj.maxTwilightPoints     = rU(data, offset);  offset += 2;
      obj.maxStorage            = rU(data, offset);  offset += 2;
      obj.maxFunctionDefs       = rU(data, offset);  offset += 2;
      obj.maxInstructionDefs    = rU(data, offset);  offset += 2;
      obj.maxStackElements      = rU(data, offset);  offset += 2;
      obj.maxSizeOfInstructions = rU(data, offset);  offset += 2;
      obj.maxComponentElements  = rU(data, offset);  offset += 2;
      obj.maxComponentDepth     = rU(data, offset);  offset += 2;
    }
    */
    // return obj;
  }
}
