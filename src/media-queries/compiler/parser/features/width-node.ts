import {Node} from '../interface';

export class WidthNode implements Node {

  constructor(private _width: number) {
  }

  public toJS(): string {
    return `width === ctx.calc(${this._width}, 'px')`;
  }

  public toSource(): string {
    return `(width: ${this._width})`;
  }
}