import {Node} from '../interface';

export class HeightNode implements Node {

  constructor(private _height: number) {
  }

  public toJS(): string {
    return `height === ctx.calc(${this._height}, 'px')`;
  }

  public toSource(): string {
    return `(height: ${this._height})`;
  }
}