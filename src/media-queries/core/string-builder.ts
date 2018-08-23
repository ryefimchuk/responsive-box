export class StringBuilder {

  constructor(private _value: string = '') {
  }

  public append(s: string): this;

  public append(sb: StringBuilder): this;

  public append(s: string | StringBuilder): this {
    this._value += s.toString();
    return this;
  }

  public clear(): void {
    this._value = '';
  }

  public toString(): string {
    return this._value;
  }
}