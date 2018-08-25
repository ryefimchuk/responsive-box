import { Compiler } from './media-queries/compiler/compiler';
import { MediaQueryListNode } from './media-queries/compiler/parser/media-query-list-node';
import { ParserError } from './media-queries/compiler/parser/parser-error';

try {

  const compiler: Compiler = new Compiler(`
    (min-width: 355) and (max-width: 500) and (min-height: 500), 
    not (max-width: 100) and (max-height: 500)
  `);
  const mediaQueryListNode: MediaQueryListNode = compiler.compile();
  console.log(mediaQueryListNode.toJS());
  console.log(mediaQueryListNode.toSource());
  console.log(JSON.stringify(mediaQueryListNode.toASTNode(), null, 2));
  console.log(mediaQueryListNode.eval(501, 100));
} catch (e) {

  if (e instanceof ParserError) {

    console.error(`${(e as ParserError).startCodeLocation}`);
  } else {

    console.error(e);
  }
}