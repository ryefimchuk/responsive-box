import { ASTNode, Node } from './interface';

interface CompiledMediaQueryList {

  (width: number, height: number): boolean;
}

export class MediaQueryListNode implements Node {

  private _function: CompiledMediaQueryList;

  constructor(private _mediaQueryNodes: Node[]) {
  }

  public toJS(): string {
    return this._mediaQueryNodes
      .map((mediaQueryNode: Node): string => mediaQueryNode.toJS())
      .join(' || ');
  }

  public toSource(): string {
    return this._mediaQueryNodes
      .map((mediaQueryNode: Node): string => mediaQueryNode.toSource())
      .join(', ');
  }

  public toASTNode(): ASTNode {
    return {
      nodeType: 'media_query_list',
      items: this._mediaQueryNodes
        .map((mediaQueryNode: Node): ASTNode => mediaQueryNode.toASTNode())
    };
  }

  public eval(width: number, height: number): boolean {

    if (!this._function) {

      this._function = new Function('width', 'height', `return ${this.toJS()};`) as CompiledMediaQueryList;
    }

    return this._function(width, height);
  }
}