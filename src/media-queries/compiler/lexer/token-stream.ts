import { Token } from './token';
import { Lexer } from './lexer';
import { TokenType } from './enum';
import { SavedState } from './interface';

export class TokenStream {

  private static _TokenStreamSavedState = class TokenStreamSavedState implements SavedState {

    private _tokenIndex: number;
    private _restored: boolean;

    constructor(private _tokenStream: TokenStream) {
      this._tokenIndex = _tokenStream._tokenIndex;
    }

    public restore(): void {

      if (this._restored) {

        throw new Error('Already restored');
      } else {

        this._tokenStream._tokenIndex = this._tokenIndex;
        this._restored = true;
      }
    }
  };

  private _stream: Token[];
  private _lexer: Lexer;
  private _tokenIndex: number;

  constructor(input: string, private _excludedTokenTypes: TokenType[] = []) {
    this._lexer = new Lexer(input);
    this._stream = [];
    this._tokenIndex = -1;
  }

  public readToken(): Token {

    let tokenIndex: number = this._tokenIndex;

    this._tokenIndex++;

    if (this._tokenIndex === this._stream.length) {

      while (true) {

        const token: Token = this._lexer.readToken();
        if (token !== null) {

          if (this._excludedTokenTypes.indexOf(token.getTokenType()) !== -1) {

            continue;
          }

          this._stream.push(token);
        }

        this._tokenIndex = tokenIndex;

        return null;
      }
    }

    return this._stream[this._tokenIndex];
  }

  public currentToken(): Token {

    if (this._tokenIndex !== -1) {

      return this._stream[this._tokenIndex];
    }

    return null;
  }

  public hasMoreTokens(): boolean {

    if (this._tokenIndex < this._stream.length - 1) {

      return true;
    } else {

      while (true) {

        const token: Token = this._lexer.readToken();
        if (token !== null) {

          if (this._excludedTokenTypes.indexOf(token.getTokenType()) !== -1) {

            continue;
          }

          this._stream.push(token);

          return true;
        }

        return false;
      }
    }
  }

  public saveState(): SavedState {
    return new TokenStream._TokenStreamSavedState(this);
  }

  public getVisualState(): string {
    return this._lexer.getVisualState();
  }
}