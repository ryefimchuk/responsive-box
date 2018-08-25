import { Node } from '../interface';

export class NotNode implements Node {

  constructor(private _expression: Node) {
  }

  public toJS(): string {
    return `!(${this._expression.toJS()})`;
  }

  public toSource(): string {
    return `not ${this._expression.toSource()}`;
  }
}