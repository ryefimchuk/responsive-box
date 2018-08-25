import { Node } from '../interface';

export class MaxHeightNode implements Node {

  constructor(private _maxHeight: number) {
  }

  public toJS(): string {
    return `height <= ${this._maxHeight}`;
  }

  public toSource(): string {
    return `(max-height: ${this._maxHeight})`;
  }
}