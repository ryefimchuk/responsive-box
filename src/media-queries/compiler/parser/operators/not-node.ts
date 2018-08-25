import { Node } from '../interface';
import { UnaryOperatorNode } from './unary-operator-node';

export class NotNode extends UnaryOperatorNode {

  constructor(expression: Node) {
    super('not', '!', expression);
  }
}