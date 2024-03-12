import { IPathData } from '../type-font.interface';
// path process
export class P {
  static moveTo(p: IPathData, x: number, y: number): void {
    p.cmds.push('M');
    p.crds.push(x, y);
  }
  static lineTo(p: IPathData, x: number, y: number): void {
    p.cmds.push('L');
    p.crds.push(x, y);
  }
  static curveTo(p: IPathData, a: number, b: number, c: number, d: number, e: number, f: number): void {
    p.cmds.push('C');
    p.crds.push(a, b, c, d, e, f);
  }
  static qCurveTo(p: IPathData, a: number, b: number, c: number, d: number): void {
    p.cmds.push('Q');
    p.crds.push(a, b, c, d);
  }
  static closePath(p: IPathData): void {
    p.cmds.push('Z');
  }
}
