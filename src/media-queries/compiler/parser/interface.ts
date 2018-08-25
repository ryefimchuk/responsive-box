export interface ASTNode {

  nodeType: string;

  [key: string]: any;
}

export interface Node {

  toJS(): string;

  toSource(): string;

  toASTNode(): ASTNode;
}