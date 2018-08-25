import { Node } from '../interface';

export class MaxWidthNode implements Node {

  constructor(private _maxWidth: number) {
  }

  public toJS(): string {
    return `width <= ${this._maxWidth}`;
  }

  public toSource(): string {
    return `(max-width: ${this._maxWidth})`;
  }
}