import { SavedState } from './interface';
import { LexerUtils } from './lexer-utils';
import { CodeLocation } from './code-location';

export class CharStream {

  private static _CharStreamSavedState = class CharStreamSavedState implements SavedState {

    private _line: number;
    private _column: number;
    private _position: number;
    private _restored: boolean;

    constructor(private _charStream: CharStream) {
      this._line = _charStream._line;
      this._column = _charStream._column;
      this._position = _charStream._position;
    }

    public restore(): void {

      if (this._restored) {

        throw new Error(`Already restored`);
      } else {

        this._charStream._line = this._line;
        this._charStream._column = this._column;
        this._charStream._position = this._position;

        this._restored = true;
      }
    }
  };

  private _input: string;
  private _line: number;
  private _column: number;
  private _position: number;
  private _length: number;

  constructor(input: string) {
    this._input = input.replace('\r\n', '\n').replace('\r', '\n');
    this._line = 1;
    this._column = 1;
    this._position = -1;
    this._length = this._input.length;
  }

  public hasMoreChars(): boolean {
    return this._position < this._length - 1;
  }

  public readChar(): string {

    if (this._position < this._length - 1) {

      const currentChar: string = this._input.charAt(++this._position);
      if (currentChar === '\n') {

        this._column = 1;
        this._line++;
      } else {

        this._column++;
      }

      return currentChar;
    }

    throw new Error(`Unexpected end of file`);
  }

  public getLine(): number {
    return this._line;
  }

  public getColumn(): number {
    return this._column;
  }

  public getPosition(): number {
    return this._position + 1;
  }

  public getCodeLocation(): CodeLocation {
    return new CodeLocation(this);
  }

  public saveState(): SavedState {
    return new CharStream._CharStreamSavedState(this);
  }

  public getVisualState(): string {

    if (this._position >= 0) {

      return LexerUtils.getVisualState(this._input, this._position);
    }

    return LexerUtils.getVisualState(this._input, 0);
  }

  public toString(): string {
    return this.getVisualState();
  }
}