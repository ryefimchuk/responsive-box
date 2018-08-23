import {Compiler} from './media-queries/compiler/compiler';
import {MediaQueryListNode} from './media-queries/compiler/parser/media-query-list-node';

const compiler: Compiler = new Compiler(`(max-width: 500) and (max-height: 750)`);
const mediaQueryListNode: MediaQueryListNode = compiler.compile();
console.log(mediaQueryListNode.toSource());
console.log(mediaQueryListNode.eval(501, 100));