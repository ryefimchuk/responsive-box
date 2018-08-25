import { TokenType } from './enum';
import { InvalidToken, Token, WhiteSpaceToken } from './token';
import { CharStream } from './char-stream';
import { CodeLocation } from './code-location';
import { StringBuilder } from '../../core/string-builder';
import { SavedState } from './interface';
import { LexerError } from './lexer-error';

type TokenTypeDictionary = { [key: string]: TokenType };

const KEY_WORD_DICTIONARY: TokenTypeDictionary = {
  'and': TokenType.AND,
  'not': TokenType.NOT
};

const SEPARATOR_DICTIONARY: TokenTypeDictionary = {
  '(': TokenType.L_PAREN,
  ')': TokenType.R_PAREN,
  ':': TokenType.COLON,
  ',': TokenType.COMMA
};

enum AppendResult {

  NOPE,
  INVALID,
  VALID
}

function isIdentifier(ch: string): boolean {
  return (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || (ch === '_') || (ch === '$');
}

function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9';
}

function isWhiteSpace(ch: string): boolean {
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\f';
}

export class Lexer {

  private _charStream: CharStream;
  private _stringBuilder: StringBuilder;

  constructor(input: string) {
    this._charStream = new CharStream(input);
    this._stringBuilder = new StringBuilder();
  }

  public readToken(): Token {

    if (this._charStream.hasMoreChars()) {

      const codeLocation: CodeLocation = this._charStream.getCodeLocation();
      this._stringBuilder.clear();

      try {

        if (this._readNumberLiteral(this._stringBuilder, codeLocation)) {

          return new Token(this._stringBuilder.toString(), TokenType.NUMBER_LITERAL, codeLocation, this._charStream.getCodeLocation());
        }

        if (this._readWhiteSpace(this._stringBuilder)) {

          return new WhiteSpaceToken(this._stringBuilder.toString(), codeLocation, this._charStream.getCodeLocation());
        }

        let ch: string = this._charStream.readChar();

        if (isIdentifier(ch)) {

          this._stringBuilder.append(ch);

          do {

            if (this._charStream.hasMoreChars()) {

              const savedState: SavedState = this._charStream.saveState();

              ch = this._charStream.readChar();
              if (isIdentifier(ch) || isDigit(ch) || ch === '-') {

                this._stringBuilder.append(ch);
              } else {

                savedState.restore();
                break;
              }

            } else {

              break;
            }
          } while (true);

          const tokenValue: string = this._stringBuilder.toString();

          if (tokenValue in KEY_WORD_DICTIONARY) {

            return new Token(tokenValue, KEY_WORD_DICTIONARY[tokenValue], codeLocation, this._charStream.getCodeLocation());
          }

          return new Token(tokenValue, TokenType.IDENTIFIER, codeLocation, this._charStream.getCodeLocation());
        }

        if (ch in SEPARATOR_DICTIONARY) {

          return new Token(ch, SEPARATOR_DICTIONARY[ch], codeLocation, this._charStream.getCodeLocation());
        }

        this._stringBuilder.append(ch);

        throw new LexerError(`Invalid symbol: '${ch}'`, codeLocation, this._charStream.getCodeLocation());

      } catch (e) {

        return new InvalidToken(this._stringBuilder.toString(), e.message, codeLocation, this._charStream.getCodeLocation());
      }
    }

    return null;
  }

  public getVisualState(): string {
    return this._charStream.getVisualState();
  }

  private _readWhiteSpace(sb: StringBuilder): boolean {

    if (this._charStream.hasMoreChars()) {

      let savedState: SavedState = this._charStream.saveState();
      let ch: string = this._charStream.readChar();

      if (isWhiteSpace(ch)) {

        sb.append(ch);

        while (true) {

          if (this._charStream.hasMoreChars()) {

            savedState = this._charStream.saveState();
            ch = this._charStream.readChar();

            if (isWhiteSpace(ch)) {

              sb.append(ch);
            } else {

              savedState.restore();
              return true;
            }
          } else {

            return true;
          }
        }
      } else {

        savedState.restore();
      }
    }

    return false;
  }

  private _readNumberLiteral(sb: StringBuilder, codeLocation: CodeLocation): boolean {

    if (this._charStream.hasMoreChars()) {

      const initialState: SavedState = this._charStream.saveState();
      const builder: StringBuilder = new StringBuilder();

      if (this._appendNumber(builder) === AppendResult.VALID) {

        switch (this._appendExponent(builder)) {
          case AppendResult.VALID: {
            sb.append(builder);
            return true;
          }
          case AppendResult.INVALID: {
            sb.append(builder);
            throw new LexerError(`Invalid number literal`, codeLocation, this._charStream.getCodeLocation());
          }
        }

        if (this._charStream.hasMoreChars()) {

          const savedState: SavedState = this._charStream.saveState();

          const ch: string = this._charStream.readChar();
          if (ch === '.') {

            builder.append(ch);

            switch (this._appendExponent(builder)) {
              case AppendResult.VALID: {
                sb.append(builder);
                return true;
              }
              case AppendResult.INVALID: {
                sb.append(builder);
                throw new LexerError(`Invalid number literal`, codeLocation, this._charStream.getCodeLocation());
              }
            }

            if (this._appendNumber(builder) === AppendResult.VALID) {

              if (this._appendExponent(builder) === AppendResult.INVALID) {

                sb.append(builder);
                throw new LexerError(`Invalid number literal`, codeLocation, this._charStream.getCodeLocation());
              }
            }
          } else {

            savedState.restore();
          }
        }

        sb.append(builder);

        return true;
      }

      const ch: string = this._charStream.readChar();
      if (ch === '.') {

        builder.append(ch);

        if (this._appendNumber(builder) === AppendResult.VALID) {

          if (this._appendExponent(builder) === AppendResult.INVALID) {

            sb.append(builder);
            throw new LexerError(`Invalid number literal`, codeLocation, this._charStream.getCodeLocation());
          }

          sb.append(builder);
          return true;
        }
      }

      initialState.restore();
    }
    return false;
  }

  private _appendNumber(sb: StringBuilder): AppendResult {

    if (this._charStream.hasMoreChars()) {

      let savedState: SavedState = this._charStream.saveState();
      let ch: string = this._charStream.readChar();

      if (isDigit(ch)) {

        sb.append(ch);

        while (true) {

          if (this._charStream.hasMoreChars()) {

            savedState = this._charStream.saveState();

            ch = this._charStream.readChar();

            if (isDigit(ch)) {

              sb.append(ch);
            } else {

              savedState.restore();
              break;
            }
          } else {
            break;
          }
        }

        return AppendResult.VALID;
      }

      savedState.restore();
    }

    return AppendResult.NOPE;
  }

  private _appendExponent(sb: StringBuilder): AppendResult {

    if (this._charStream.hasMoreChars()) {

      let savedState: SavedState = this._charStream.saveState();
      let ch: string = this._charStream.readChar();

      if (ch === 'e' || ch === 'E') {

        sb.append(ch);

        if (this._charStream.hasMoreChars()) {

          savedState = this._charStream.saveState();

          ch = this._charStream.readChar();

          if (ch === '+' || ch === '-') {

            sb.append(ch);
          } else {

            savedState.restore();
          }

          if (this._appendNumber(sb) === AppendResult.VALID) {

            return AppendResult.VALID;
          }
        }

        return AppendResult.INVALID;
      }

      savedState.restore();
    }

    return AppendResult.NOPE;
  }
}
