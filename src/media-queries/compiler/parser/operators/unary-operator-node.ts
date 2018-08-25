import { ASTNode, Node } from '../interface';

export class UnaryOperatorNode implements Node {

  constructor(private _name: string,
              private _jsSource: string,
              protected expression: Node) {
  }

  public toJS(): string {
    return `${this._jsSource}(${this.expression.toJS()})`;
  }

  public toSource(): string {
    return `${this._name} ${this.expression.toSource()}`;
  }


  public toASTNode(): ASTNode {
    return {
      nodeType: 'unary_operator',
      name: this._name,
      expression: this.expression.toASTNode()
    };
  }
}