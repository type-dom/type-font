import { Bin, Lctf } from '../core';

export class GSUB {
  public static parse(data: Uint8Array, offset: number, length: number, font: any): any {
    return Lctf.parse(data, offset, length, font, GSUB.subt);
  }
  public static subt(data: Uint8Array, ltype: any, offset: number): any {
    let offset0 = offset;
    let tab: any = {};

    if (ltype !== 1 && ltype !== 4 && ltype !== 5) { return null }

    tab.fmt = Bin.readUshort(data, offset); offset += 2;
    let covOff  = Bin.readUshort(data, offset); offset += 2;
    tab.coverage = Lctf.readCoverage(data, covOff + offset0);

    if (false) {
    //   todo
    }
    //  Single Substitution Subtable
    else if (ltype === 1) {
      if (tab.fmt === 1) {
        tab.delta = Bin.readShort(data, offset); offset += 2;
      }
      else if (tab.fmt === 2) {
        let cnt = Bin.readUshort(data, offset); offset += 2;
        tab.newg = Bin.readUshorts(data, offset, cnt); offset += tab.newg.length * 2;
      }
    }
    //  Ligature Substitution Subtable
    else if (ltype === 4) {
      tab.vals = [];
      let cnt = Bin.readUshort(data, offset); offset += 2;
      for (let i = 0; i < cnt; i++) {
        let loff = Bin.readUshort(data, offset); offset += 2;
        tab.vals.push(GSUB.readLigatureSet(data, offset0 + loff));
      }
    }
    //  Contextual Substitution Subtable
    else if (ltype === 5) {
      if (tab.fmt === 2) {
        let cDefOffset = Bin.readUshort(data, offset); offset += 2;
        tab.cDef = Lctf.readClassDef(data, offset0 + cDefOffset);
        tab.scset = [];
        let subClassSetCount = Bin.readUshort(data, offset); offset += 2;
        for (let i = 0; i < subClassSetCount; i++) {
          let scsOff = Bin.readUshort(data, offset); offset += 2;
          tab.scset.push(scsOff === 0 ? null : GSUB.readSubClassSet(data, offset0 + scsOff));
        }
      }
      else { console.log('unknown table format', tab.fmt) }
    }

    return tab;
  }
  public static readSubClassSet(data: Uint8Array, offset: number): any {
    let rUs = Bin.readUshort;
    let offset0 = offset;
    let lset = [];
    let cnt = rUs(data, offset); offset += 2;
    for (let i = 0; i < cnt; i++) {
      let loff = rUs(data, offset); offset += 2;
      lset.push(GSUB.readSubClassRule(data, offset0 + loff));
    }
    return lset;
  }
  public static readSubClassRule(data: Uint8Array, offset: number): any {
    let rUs = Bin.readUshort;
    let offset0 = offset;
    let rule: any = {};
    let gcount = rUs(data, offset); offset += 2;
    let scount = rUs(data, offset); offset += 2;
    rule.input = [];
    for (let i = 0; i < gcount - 1; i++) {
      rule.input.push(rUs(data, offset)); offset += 2;
    }
    rule.substLookupRecords = GSUB.readSubstLookupRecords(data, offset, scount);
    return rule;
  }
  public static readSubstLookupRecords(data: Uint8Array, offset: number, cnt: any): any {
    let rUs = Bin.readUshort;
    let out = [];
    for (let i = 0; i < cnt; i++) { out.push(rUs(data, offset), rUs(data, offset + 2)); offset += 4 }
    return out;
  }
  public static readChainSubClassSet(data: Uint8Array, offset: number): any {
    let offset0 = offset;
    let lset = [];
    let cnt = Bin.readUshort(data, offset); offset += 2;
    for (let i = 0; i < cnt; i++) {
      let loff = Bin.readUshort(data, offset); offset += 2;
      lset.push(GSUB.readChainSubClassRule(data, offset0 + loff));
    }
    return lset;
  }
  public static readChainSubClassRule(data: Uint8Array, offset: number): any {
    let offset0 = offset;
    let rule: any = {};
    let pps = ['backtrack', 'input', 'lookahead'];
    for (let pi = 0; pi < pps.length; pi++) {
      let cnt = Bin.readUshort(data, offset); offset += 2; if (pi === 1) { cnt-- }
      rule[pps[pi]] = Bin.readUshorts(data, offset, cnt); offset += rule[pps[pi]].length * 2;
    }
    let cnt = Bin.readUshort(data, offset); offset += 2;
    rule.subst = Bin.readUshorts(data, offset, cnt * 2); offset += rule.subst.length * 2;
    return rule;
  }
  public static readLigatureSet(data: Uint8Array, offset: number): any {
    let offset0 = offset;
    let lset = [];
    let lcnt = Bin.readUshort(data, offset); offset += 2;
    for (let j = 0; j < lcnt; j++) {
      let loff = Bin.readUshort(data, offset); offset += 2;
      lset.push(GSUB.readLigature(data, offset0 + loff));
    }
    return lset;
  }
  public static readLigature(data: Uint8Array, offset: number): any {
    let lig: any = { chain: [] };
    lig.nglyph = Bin.readUshort(data, offset); offset += 2;
    let ccnt = Bin.readUshort(data, offset); offset += 2;
    for (let k = 0; k < ccnt - 1; k++) { lig.chain.push(Bin.readUshort(data, offset)); offset += 2 }
    return lig;
  }
}
