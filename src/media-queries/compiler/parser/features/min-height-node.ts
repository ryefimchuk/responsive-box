import { Node } from '../interface';

export class MinHeightNode implements Node {

  constructor(private _minHeight: number) {
  }

  public toJS(): string {
    return `height >= ${this._minHeight}`;
  }

  public toSource(): string {
    return `(min-height: ${this._minHeight})`;
  }
}