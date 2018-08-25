import { Node } from '../interface';

export class WidthNode implements Node {

  constructor(private _width: number) {
  }

  public toJS(): string {
    return `width === ${this._width}`;
  }

  public toSource(): string {
    return `(width: ${this._width})`;
  }
}