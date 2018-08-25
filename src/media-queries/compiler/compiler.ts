import { TokenStream } from './lexer/token-stream';
import { InvalidToken, Token } from './lexer/token';
import { TokenType } from './lexer/enum';
import { LexerError } from './lexer/lexer-error';
import { SavedState } from './lexer/interface';
import { ParserError } from './parser/parser-error';
import { MediaQueryListNode } from './parser/media-query-list-node';
import { Node } from './parser/interface';
import { AndNode } from './parser/operators/and-node';
import { NotNode } from './parser/operators/not-node';
import { WidthNode } from './parser/features/width-node';
import { MaxWidthNode } from './parser/features/max-width-node';
import { MinWidthNode } from './parser/features/min-width-node';
import { HeightNode } from './parser/features/height-node';
import { MinHeightNode } from './parser/features/min-height-node';
import { MaxHeightNode } from './parser/features/max-height-node';

const MEDIA_FEATURES: string[] = ['width', 'min-width', 'max-width', 'height', 'min-height', 'max-height'];

export class Compiler {

  private _tokenStream: TokenStream;

  constructor(source: string) {
    this._tokenStream = new TokenStream(source, [TokenType.WHITE_SPACE]);
  }

  public compile(): MediaQueryListNode {
    return this._mediaQueryList();
  }

  private _mediaQueryList(): MediaQueryListNode {

    const mediaQueryNodes: Node[] = [];

    while (true) {

      const nextMediaQueryNode = this._mediaQuery();
      if (!nextMediaQueryNode) {

        if (mediaQueryNodes.length !== 0) {

          throw this._syntaxError(`Media query expression is expected.`);
        }

        break;
      }

      mediaQueryNodes.push(nextMediaQueryNode);

      if (this._accept(TokenType.COMMA)) {

        continue;
      }

      break;
    }

    return new MediaQueryListNode(mediaQueryNodes);
  }

  private _mediaQuery(): Node {

    let isInversion: boolean;
    let expression: Node;

    if (this._accept(TokenType.NOT)) {

      isInversion = true;
    }

    while (true) {

      if (this._accept(TokenType.AND)) {

        if (!expression) {

          throw this._syntaxError(`Left media query expression is expected.`);
        }

        const leftNode: Node = expression;
        const rightNode: Node = this._expression();

        if (!rightNode) {

          throw this._syntaxError(`Right media query expression is expected.`);
        }

        expression = new AndNode(leftNode, rightNode);
        continue;
      }

      const nextExpressionNode = this._expression();
      if (!nextExpressionNode) {

        break;
      } else {

        expression = nextExpressionNode;
      }
    }

    if (isInversion) {

      if (expression) {

        return new NotNode(expression);
      }

      throw this._syntaxError(`Media query expression is expected.`);
    }

    return expression;
  }

  private _expression(): Node {

    if (this._accept(TokenType.L_PAREN)) {

      if (!this._hasMoreTokens()) {

        throw this._syntaxError(`Identifier expected.`);
      }

      let result: Node;
      const identifierToken: Token = this._readToken();

      if (identifierToken.getTokenType() !== TokenType.IDENTIFIER) {

        throw this._syntaxError(`Identifier expected.`);
      }

      if (MEDIA_FEATURES.indexOf(
        identifierToken.getValue()
      ) === -1) {

        throw this._syntaxError(`Unknown media feature: ${identifierToken.getValue()}`);
      }

      this._expect(TokenType.COLON);

      if (!this._hasMoreTokens()) {

        throw this._syntaxError(`Invalid expression.`);
      }

      switch (identifierToken.getValue()) {
        case 'width': {
          result = new WidthNode(
            this._asNumber(
              this._readToken()
            )
          );
          break;
        }
        case 'min-width': {
          result = new MinWidthNode(
            this._asNumber(
              this._readToken()
            )
          );
          break;
        }
        case 'max-width': {
          result = new MaxWidthNode(
            this._asNumber(
              this._readToken()
            )
          );
          break;
        }
        case 'height': {
          result = new HeightNode(
            this._asNumber(
              this._readToken()
            )
          );
          break;
        }
        case 'min-height': {
          result = new MinHeightNode(
            this._asNumber(
              this._readToken()
            )
          );
          break;
        }
        case 'max-height': {
          result = new MaxHeightNode(
            this._asNumber(
              this._readToken()
            )
          );
          break;
        }
      }

      this._expect(TokenType.R_PAREN);

      return result;
    }
  }

  private _readToken(): Token {

    const token: Token = this._tokenStream.readToken();
    if (token != null && token.getTokenType() == TokenType.INVALID_TOKEN) {

      const invalidToken: InvalidToken = token as InvalidToken;
      throw new LexerError(invalidToken.getMessage(), invalidToken.getStartCodeLocation(), invalidToken.getEndCodeLocation());
    }

    return token;
  }

  private _currentToken(): Token {
    return this._tokenStream.currentToken();
  }

  private _saveState(): SavedState {
    return this._tokenStream.saveState();
  }

  private _hasMoreTokens(): boolean {
    return this._tokenStream.hasMoreTokens();
  }

  private _accept(tokenType: TokenType): boolean {

    if (this._hasMoreTokens()) {

      const savedState: SavedState = this._saveState();
      const token: Token = this._readToken();

      if (token != null && token.getTokenType() == tokenType) {

        return true;
      }

      savedState.restore();
    }

    return false;
  }

  private _expect(tokenType: TokenType): void {

    if (!this._accept(tokenType)) {

      if (this._hasMoreTokens()) {

        throw this._syntaxError(`Expected token ${TokenType[tokenType]}, but ${TokenType[this._readToken().getTokenType()]} found.`);
      }

      throw this._syntaxError(`Expected token ${TokenType[tokenType]}, but EOF found.`);
    }
  }

  private _syntaxError(message: string): ParserError {
    const token: Token = this._currentToken();
    return new ParserError(message, token.getStartCodeLocation(), token.getEndCodeLocation());
  }

  private _asNumber(token: Token): number {

    if (!token || token.getTokenType() !== TokenType.NUMBER_LITERAL) {

      throw this._syntaxError(`Number expected but ${token} has been found`);
    }

    return +token.getValue();
  }

  private _asConstant(token: Token, expectedValues: string[]): string {

    if (expectedValues.indexOf(token.getValue()) === -1) {

      throw this._syntaxError(`${expectedValues.join(' or ')} expected but ${token} has been found`);
    }

    return token.getValue();
  }
}