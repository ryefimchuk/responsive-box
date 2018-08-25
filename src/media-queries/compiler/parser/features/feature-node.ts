import { ASTNode, Node } from '../interface';

export abstract class FeatureNode implements Node {

  constructor(protected name: string,
              protected value: any) {
  }

  public abstract toJS(): string;

  public toSource(): string {
    return `(${this.name}: ${this.value})`;
  }

  public toASTNode(): ASTNode {
    return {
      nodeType: 'feature',
      name: this.name,
      value: this.value
    };
  }
}