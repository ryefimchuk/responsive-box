import {Node} from '../interface';

export class MaxHeightNode implements Node {

  constructor(private _maxHeight: number) {
  }

  public toJS(): string {
    return `height <= ctx.calc(${this._maxHeight}, 'px')`;
  }

  public toSource(): string {
    return `(max-height: ${this._maxHeight})`;
  }
}