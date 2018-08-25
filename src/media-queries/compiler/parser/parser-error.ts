import { CodeLocation } from '../lexer/code-location';

export class ParserError extends Error {

  public get startCodeLocation(): CodeLocation {
    return this._startCodeLocation;
  }

  public get endCodeLocation(): CodeLocation {
    return this._endCodeLocation;
  }

  constructor(message: string,
              private _startCodeLocation: CodeLocation,
              private _endCodeLocation: CodeLocation) {
    super(message);
  }
}