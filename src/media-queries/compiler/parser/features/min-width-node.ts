import { Node } from '../interface';

export class MinWidthNode implements Node {

  constructor(private _minWidth: number) {
  }

  public toJS(): string {
    return `width >= ${this._minWidth}`;
  }

  public toSource(): string {
    return `(min-width: ${this._minWidth})`;
  }
}