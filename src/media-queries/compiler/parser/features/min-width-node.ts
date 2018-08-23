import {Node} from '../interface';

export class MinWidthNode implements Node {

  constructor(private _minWidth: number) {
  }

  public toJS(): string {
    return `width >= ctx.calc(${this._minWidth}, 'px')`;
  }

  public toSource(): string {
    return `(min-width: ${this._minWidth})`;
  }
}