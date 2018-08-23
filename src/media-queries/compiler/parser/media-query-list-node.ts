import {Node} from './interface';

interface CompiledMediaQueryList {

  (width: number, height: number, context: any): boolean;
}

export class MediaQueryListNode implements Node {

  private _function: CompiledMediaQueryList;
  private _context: any;

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

  public eval(width: number, height: number): boolean {

    if (!this._function) {

      this._function = new Function('width', 'height', 'ctx', `return ${this.toJS()};`) as CompiledMediaQueryList;
    }

    if (!this._context) {

      this._context = {
        calc: (value: number, dimension: 'px'): number => value
      };
    }

    return this._function(width, height, this._context);
  }
}