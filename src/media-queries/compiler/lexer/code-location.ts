import { CharStream } from './char-stream';

export class CodeLocation {

  private _line: number;
  private _column: number;
  private _position: number;

  constructor(charStream: CharStream) {
    this._line = charStream.getLine();
    this._column = charStream.getColumn();
    this._position = charStream.getPosition();
  }

  public getLine(): number {
    return this._line;
  }

  public getColumn(): number {
    return this._column;
  }

  public getPosition(): number {
    return this._position;
  }

  public toString(): string {
    return `line: ${this._line}, column: ${this._column}, position: ${this._position}`;
  }
}