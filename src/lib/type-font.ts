import { B } from './Bin';
import { Glyf } from './tabs/glyf';
import { CFF } from './tabs/cff';
import { Kern } from './tabs/kern';
import { SVG } from './tabs/SVG';
import { CBLC } from './tabs/CBLC';
import { Sbix } from './tabs/sbix';
import { Hhea } from './tabs/hhea';
import { OS2 } from './tabs/OS2';
import { Head } from './tabs/head';
import { CBDT } from './tabs/CBDT';
import { Name } from './tabs/name';
import { Loca } from './tabs/loca';
import { Post } from './tabs/post';
import { Cpal } from './tabs/cpal';
import { Cmap, SubTable } from './tabs/cmap';
import { Hmtx } from './tabs/hmtx';
import { Colr } from './tabs/colr';
import { Maxp } from './tabs/maxp';
export class TypeFont {
  _data: Uint8Array;
  _index: number;
  _offset: number;
  __tmp?: Record<string, string>;
  cmap?: Cmap;
  head?: Head;
  hhea?: Hhea;
  maxp?: Maxp;
  hmtx?: Hmtx;
  name?: Name;
  'OS/2'?: OS2;
  post?: Post;
  loca?: number[];
  kern?: Kern;
  glyf?: null[];
  'CFF '?: CFF;
  // "GPOS",
  // "GSUB",
  // "GDEF",
  CBLC?: Array<[number, number, number, number[]]>;
  CBDT?: Uint8Array;
  'SVG '?: SVG;
  COLR?: [Record<string, [number, number]>, number[]];
  CPAL?: Uint8Array;
  sbix?: (Uint8Array | null)[];
  // "VORG",
  _ctab?: SubTable | null;
  constructor(data: Uint8Array, idx: number, offset: number) {
    this._data = data;
    this._index = idx;
    this._offset = offset;
    const tagArr: string[] = ['cmap', 'head', 'hhea', 'maxp', 'hmtx', 'name', 'OS/2', 'post',
      'loca', 'kern', 'glyf', 'CFF ', 'CBLC', 'CBDT', 'SVG ', 'COLR', 'CPAL', 'sbix'
      // "GPOS",// "GSUB",// "GDEF", "VORG",
    ];
    tagArr.forEach(key => {
      // [offset, length]
      let tab = TypeFont.findTable(data, key, offset);
      if (tab) {
        let off = tab[0];
        switch (key) {
          case 'cmap':
            this.cmap = new Cmap(data, off, tab[1]);
            break;
          case 'head':
            this.head = new Head(data, off, tab[1]);
            break;
          case 'hhea':
            this.hhea = new Hhea(data, off, tab[1]);
            break;
          case 'maxp':
            this.maxp = new Maxp(data, off, tab[1]);
            break;
          case 'hmtx':
            this.hmtx = new Hmtx(data, off, tab[1], this);
            break;
          case 'name':
            this.name = Name.parseTab(data, off, tab[1]);
            break;
          case 'OS/2':
            this['OS/2'] = new OS2(data, off, tab[1]);
            break;
          case 'post':
            this.post = new Post(data, off, tab[1]);
            break;
          case 'loca':
            this.loca = Loca.parseTab(data, off, tab[1], this);
            break;
          case 'kern':
            console.error('type-font tagName kern . ');
            this.kern = new Kern(data, off, tab[1], this);
            break;
          case 'glyf':
            this.glyf = Glyf.parseTab(data, off, tab[1], this);
            break;
          case 'CFF ':
            console.error('type-font tagName CFF . ');
            this['CFF '] = new CFF(data, off, tab[1]);
            break;
          case 'CBLC':
            this.CBLC = CBLC.parseTab(data, off, tab[1]);
            break;
          case 'CBDT':
            this.CBDT = CBDT.parseTab(data, off, tab[1]);
            break;
          case 'SVG ':
            this['SVG '] = new SVG(data, off, tab[1]);
            break;
          case 'COLR':
            this.COLR = Colr.parseTab(data, off, tab[1]);
            break;
          case 'CPAL':
            this.CPAL = Cpal.parseTab(data, off, tab[1]);
            break;
          case 'sbix':
            this.sbix = Sbix.parseTab(data, off, tab[1], this);
            break;
        }
      }
    });
    // console.log('obj is ', obj);
    // todo 这段是另加的
    if (!this.head) {
      this['CFF '] = new CFF(data, 0, data.length);
    }
  }
  // static U = U;
  static parse(buff: ArrayBuffer): TypeFont[] {
    let data = new Uint8Array(buff);
    // let tmap = {} as ITagFont;
    let tag = B.readASCII(data, 0, 4);
    // console.log('tag is ', tag);
    if (tag === 'ttcf') {
      let offset = 4;
      let majV = B.readUshort(data, offset);
      offset += 2;
      let minV = B.readUshort(data, offset);
      offset += 2;
      let numF = B.readUint(data, offset);
      offset += 4;
      let fnts = [];
      for (let i = 0; i < numF; i++) {
        let foff = B.readUint(data, offset);
        offset += 4;
        fnts.push(new TypeFont(data, i, foff));
      }
      return fnts;
    } else {
      return [new TypeFont(data, 0, 0)];
    }
  }

  /**
   * return [toffset, length]
   * @param data
   * @param tab
   * @param fOff
   */
  static findTable(data: Uint8Array, tab: string, fOff: number): [number, number] | null {
    // console.log('findTable . ');
    // console.log('tab is ', tab);
    // console.log('foff is ', foff);
    let bin = B;
    let numTables = bin.readUshort(data, fOff + 4);
    let offset = fOff + 12;
    for (let i = 0; i < numTables; i++) {
      let tag = bin.readASCII(data, offset, 4);   // console.log(tag);
      // console.log('tag  is ', tag);
      let checkSum = bin.readUint(data, offset + 4);
      let toffset = bin.readUint(data, offset + 8);
      let length = bin.readUint(data, offset + 12);
      if (tag === tab) {
        return [toffset, length];
      }
      offset += 16;
    }
    return null;
  }
}
