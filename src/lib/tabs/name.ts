import { B } from '../Bin';
export class Name {
  _lang?: number;
  copyright?: string;
  fontFamily?: string;
  fontSubfamily?: string;
  ID?: string;
  fullName?: string;
  version?: string;
  postScriptName?: string;
  trademark?: string;
  manufacturer?: string;
  designer?: string;
  description?: string;
  urlVendor?: string;
  urlDesigner?: string;
  licence?: string;
  licenceURL?: string;
  ['---']?: string;
  typoFamilyName?: string;
  typoSubfamilyName?: string;
  compatibleFull?: string;
  sampleText?: string;
  postScriptCID?: string;
  wwsFamilyName?: string;
  wwsSubfamilyName?: string;
  lightPalette?: string;
  darkPalette?: string;
  constructor(obj: Record<string, any>) {
    // console.log(obj);
    for (let p in obj) {
      // console.log('obj[p].postScriptName is ', obj[p].postScriptName); // undefined
      if (obj[p].postScriptName !== undefined && obj[p]['_lang'] === 0x0409) {
        this.setProperty(obj[p]);
      }
    } // United States
    for (let p in obj) {
      if (obj[p].postScriptName !== undefined && obj[p]['_lang'] === 0x0000) {
        this.setProperty(obj[p]);
      }
    }// Universal
    for (let p in obj) {
      if (obj[p].postScriptName !== undefined && obj[p]['_lang'] === 0x0c0c) {
        this.setProperty(obj[p]);
      }
    } // Canada
    for (let p in obj) {
      if (obj[p].postScriptName !== undefined) {
        this.setProperty(obj[p]);
      }
    }
    let out: Record<string, string | number | null> = {};
    for (const p in obj) {
      out = obj[p];
      break;
    }
    // console.log('returning name table with languageID ' + out._lang);
    console.error('out.postScriptName is ', out.postScriptName); // string
    console.error('out.ID is ', out.ID); // string
    if (out.postScriptName === undefined && out.ID !== undefined) {
      out.postScriptName = out.ID;
    }
    if (out.fontFamily === undefined) {
      for (let p in obj) {
        // console.error('obj[' + p + '].fontFamily is ', obj[p].fontFamily);
        if (obj[p].fontFamily !== undefined) {
          out.fontFamily = obj[p].fontFamily;
        }
      }
    }
    this.setProperty(out);
  }
  setProperty(obj: Record<string, string | number | null>): void {
    for (const key in obj) {
      (this as any)[key] = obj[key];
    }
  }
  static parseTab(data: Uint8Array, offset: number, length?: number): any {
    let bin = B;
    let obj: Record<string, any> = {};
    let format = bin.readUshort(data, offset);
    offset += 2;
    let count = bin.readUshort(data, offset);
    offset += 2;
    let stringOffset = bin.readUshort(data, offset);
    offset += 2;
    // console.log(format,count);
    const names = [
      'copyright',
      'fontFamily',
      'fontSubfamily',
      'ID',
      'fullName',
      'version',
      'postScriptName',
      'trademark',
      'manufacturer',
      'designer',
      'description',
      'urlVendor',
      'urlDesigner',
      'licence',
      'licenceURL',
      '---',
      'typoFamilyName',
      'typoSubfamilyName',
      'compatibleFull',
      'sampleText',
      'postScriptCID',
      'wwsFamilyName',
      'wwsSubfamilyName',
      'lightPalette',
      'darkPalette'
    ];
    let offset0 = offset;
    for (let i = 0; i < count; i++) {
      let platformID = bin.readUshort(data, offset);
      offset += 2;
      let encodingID = bin.readUshort(data, offset);
      offset += 2;
      let languageID = bin.readUshort(data, offset);
      offset += 2;
      let nameID = bin.readUshort(data, offset);
      offset += 2;
      let slen = bin.readUshort(data, offset);
      offset += 2;
      let noffset = bin.readUshort(data, offset);
      offset += 2;
      // console.log(platformID, encodingID, languageID.toString(16), nameID, length, noffset);
      let soff = offset0 + count * 12 + noffset;
      let str: string;
      if (false) {
      //   todo
      } else if (platformID === 0) {
        str = bin.readUnicode(data, soff, slen / 2);
      } else if (platformID === 3 && encodingID === 0) {
        str = bin.readUnicode(data, soff, slen / 2);
      } else if (platformID === 1 && encodingID === 25) {
        str = bin.readUnicode(data, soff, slen / 2);
      } else if (encodingID === 0) {
        str = bin.readASCII(data, soff, slen);
      } else if (encodingID === 1) {
        str = bin.readUnicode(data, soff, slen / 2);
      } else if (encodingID === 3) {
        str = bin.readUnicode(data, soff, slen / 2);
      } else if (encodingID === 4) {
        str = bin.readUnicode(data, soff, slen / 2);
      } else if (encodingID === 5) {
        str = bin.readUnicode(data, soff, slen / 2);
      } else if (encodingID === 10) {
        str = bin.readUnicode(data, soff, slen / 2);
      } else if (platformID === 1) {
        str = bin.readASCII(data, soff, slen);
        console.log('reading unknown MAC encoding ' + encodingID + ' as ASCII');
      } else {
        console.log('unknown encoding ' + encodingID + ', platformID: ' + platformID);
        str = bin.readASCII(data, soff, slen);
      }
      let tid = 'p' + platformID + ',' + (languageID).toString(16);// Typr._platforms[platformID];
      if (obj[tid] === undefined) {
        obj[tid] = {};
      }
      // console.log('nameID is ', nameID);
      // console.log('names[' + nameID + '] is ', names[nameID]);
      obj[tid][names[nameID]] = str;
      obj[tid]['_lang'] = languageID;
      // console.log(tid, obj[tid]);
    }
    /*
    if(format === 1)
    {
      let langTagCount = bin.readUshort(data, offset);  offset += 2;
      for(let i=0; i<langTagCount; i++)
      {
        let length  = bin.readUshort(data, offset);  offset += 2;
        let noffset = bin.readUshort(data, offset);  offset += 2;
      }
    }
    */
    return new Name(obj);
    // let out = Name.selectOne(obj);
    // // console.error('out.fontFamily is ', out.fontFamily); // undefined
    // if (out.fontFamily === undefined) {
    //   for (let p in obj) {
    //     console.error('obj[' + p + '].fontFamily is ', obj[p].fontFamily);
    //     if (obj[p].fontFamily !== undefined) {
    //       out.fontFamily = obj[p].fontFamily;
    //     }
    //   }
    // }
    // return out;
  }
  static selectOne(obj: Record<string, any>): any {
    // console.log(obj);
    for (let p in obj) {
      // console.log('obj[p].postScriptName is ', obj[p].postScriptName); // undefined
      if (obj[p].postScriptName !== undefined && obj[p]['_lang'] === 0x0409) {
        return obj[p];
      }
    } // United States
    for (let p in obj) {
      if (obj[p].postScriptName !== undefined && obj[p]['_lang'] === 0x0000) {
        return obj[p];
      }
    }// Universal
    for (let p in obj) {
      if (obj[p].postScriptName !== undefined && obj[p]['_lang'] === 0x0c0c) {
        return obj[p];
      }
    } // Canada
    for (let p in obj) {
      if (obj[p].postScriptName !== undefined) {
        return obj[p];
      }
    }
    let out: Record<string, string | number | null> = {};
    for (const p in obj) {
      out = obj[p];
      break;
    }
    console.log('returning name table with languageID ' + out._lang);
    console.error('out.postScriptName is ', out.postScriptName);
    console.error('out.ID is ', out.ID);
    if (out.postScriptName === null && out.ID !== null) {
      out.postScriptName = out.ID;
    }
    return out;
  }
}
