import { ASTNode, Node } from '../interface';

export class BinaryOperatorNode implements Node {

  constructor(private _name: string,
              private _jsSource: string,
              protected leftExpression: Node,
              protected rightExpression: Node) {
  }

  public toJS(): string {
    return `(${this.leftExpression.toJS()} ${this._jsSource} ${this.rightExpression.toJS()})`;
  }

  public toSource(): string {
    return `${this.leftExpression.toSource()} ${this._name} ${this.rightExpression.toSource()}`;
  }


  public toASTNode(): ASTNode {
    return {
      nodeType: 'binary_operator',
      name: this._name,
      leftExpression: this.leftExpression.toASTNode(),
      rightExpression: this.rightExpression.toASTNode()
    };
  }
}