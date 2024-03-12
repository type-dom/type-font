// SVG fonts might contain "X". Then, nothing would stroke non-SVG glyphs.
export type IPathCommand = 'M' | 'L' | 'C' | 'Q' | 'Z' | 'X' | string;
export interface IPathData {
  cmds: IPathCommand[], // M Q C A Z
  crds: number[],
}

export interface ISize {
  val: string | number,
  size: number,
}
export interface ICFFDict {
  ROS?: number,
  Bias: number,
  CharStrings: number,
  Encoding: number,
  FontBBox: [number, number, number, number]
  FontMatrix: [number, number, number, number, number, number]
  FullName: string
  ItalicAngle: number,
  Notice: string,
  PaintType: number,
  Private: number[],
  StrokeWidth: number,
  Subrs: number,
  UnderlinePosition: number,
  UnderlineThickness: number,
  charset: number,
  version: string,
  FDSelect: number,
  FDArray: number,
  defaultWidthX: number,
  [propName: string]: undefined | number | string | any[],
}
export interface ICFFTab {
  ROS: number,
  Bias: number,
  CharStrings: Uint8Array[],
  Encoding: number,
  FontBBox: [number, number, number, number]
  FontMatrix: [number, number, number, number, number, number]
  FullName: string
  ItalicAngle: number,
  Notice: string,
  PaintType: number,
  Private: ICFFTab,
  StrokeWidth: number,
  Subrs: Uint8Array[],
  UnderlinePosition: number,
  UnderlineThickness: number,
  charset: [string, ...number[]],
  version: string,
  FDSelect: number[],
  FDArray: ICFFDict[],
  defaultWidthX: number,
  nominalWidthX: number
}
export interface ILMap {
  M: number,
  L: number,
  Q: number,
  C: number,
  Z?: number,
}
export interface IShape {
  g: number,
  cl: number,
  ax: number,
  ay: number,
  dx: number,
  dy: number,
}
export interface IState {
  x: number,
  y: number,
  stack: number[],
  nStems: number,
  haveWidth: boolean,
  width: number,
  open: boolean,
}
