import { Node } from '../interface';

export class AndNode implements Node {

  constructor(private _leftExpression: Node,
              private _rightExpression: Node) {
  }

  public toJS(): string {
    return `(${this._leftExpression.toJS()} && ${this._rightExpression.toJS()})`;
  }

  public toSource(): string {
    return `${this._leftExpression.toSource()} and ${this._rightExpression.toSource()}`;
  }
}