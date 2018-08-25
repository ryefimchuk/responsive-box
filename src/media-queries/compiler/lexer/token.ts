import { CodeLocation } from './code-location';
import { TokenType } from './enum';

export class Token {

  constructor(private _value: string,
              private _tokenType: TokenType,
              private _startCodeLocation: CodeLocation,
              private _endCodeLocation: CodeLocation) {
  }

  public getValue(): string {
    return this._value;
  }

  public getTokenType(): TokenType {
    return this._tokenType;
  }

  public getLine(): number {
    return this._startCodeLocation.getLine();
  }

  public getColumn(): number {
    return this._startCodeLocation.getColumn();
  }

  public getPosition(): number {
    return this._startCodeLocation.getPosition();
  }

  public getStartCodeLocation(): CodeLocation {
    return this._startCodeLocation;
  }

  public getEndCodeLocation(): CodeLocation {
    return this._endCodeLocation;
  }

  public getSourceValue(): string {
    return this._value;
  }

  public toString(): string {
    return `'${this.getSourceValue()}': ${TokenType[this._tokenType]}, StartCodeLocation: [${this._startCodeLocation}], EndCodeLocation: [${this._endCodeLocation}]`;
  }
}

export class InvalidToken extends Token {

  constructor(value: string, private _message: string, startCodeLocation: CodeLocation, endCodeLocation: CodeLocation) {
    super(value, TokenType.INVALID_TOKEN, startCodeLocation, endCodeLocation);
  }

  public getMessage(): string {
    return this._message;
  }

  public toString(): string {
    return `${super.toString()}, Message: ${this._message}`;
  }
}

export class WhiteSpaceToken extends Token {

  constructor(value: string, startCodeLocation: CodeLocation, endCodeLocation: CodeLocation) {
    super(value, TokenType.WHITE_SPACE, startCodeLocation, endCodeLocation);
  }

  public getSourceValue(): string {

    let value = this.getValue();

    if (value.indexOf('\b') !== -1) {

      value = value.replace('\b', '\\b');
    }

    if (value.indexOf('\f') !== -1) {

      value = value.replace('\f', '\\f');
    }

    if (value.indexOf('\n') !== -1) {

      value = value.replace('\n', '\\n');
    }

    if (value.indexOf('\r') !== -1) {

      value = value.replace('\r', '\\r');
    }

    if (value.indexOf('\t') !== -1) {

      value = value.replace('\t', '\\t');
    }

    return value;
  }
}
