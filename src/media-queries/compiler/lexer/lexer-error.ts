import {CodeLocation} from './code-location';

export class LexerError extends Error {

  constructor(message: string, private _startCodeLocation: CodeLocation, private _endCodeLocation: CodeLocation) {
    super(message);
  }

  public get startCodeLocation(): CodeLocation {
    return this._startCodeLocation;
  }

  public get endCodeLocation(): CodeLocation {
    return this._endCodeLocation;
  }
}