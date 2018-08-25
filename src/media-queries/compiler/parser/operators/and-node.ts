import { Node } from '../interface';
import { BinaryOperatorNode } from './binary-operator-node';

export class AndNode extends BinaryOperatorNode {

  constructor(leftExpression: Node, rightExpression: Node) {
    super('and', '&&', leftExpression, rightExpression);
  }
}