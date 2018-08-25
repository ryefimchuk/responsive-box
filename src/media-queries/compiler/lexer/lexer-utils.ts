export class LexerUtils {

  private constructor() {
  }

  public static getVisualState(input: string, position: number): string {

    if (position < 0 || position >= input.length) {

      throw new Error(`Position out of range: ${position}`);
    }

    let leftResult: string = '';
    let rightResult: string = '';
    let result: string = '';
    let pointerResult: string = '';

    if (position !== 0) {

      for (let index = position - 1; index >= 0; index--) {

        const c: string = input.charAt(index);
        if (c === '\n') {
          break;
        }

        leftResult += c;
        pointerResult += ' ';
      }
    }

    result += leftResult.split('').reverse().join('');
    result += input.charAt(position);
    pointerResult += '^';

    if (position !== input.length - 1) {

      for (let index = position + 1; index < input.length; index++) {

        const c: string = input.charAt(index);
        if (c === '\n') {

          break;
        }

        rightResult += c;
        pointerResult += ' ';
      }
    }

    result += rightResult;
    result += '\n';
    result += pointerResult;

    return result;
  }
}