import { FeatureNode } from './feature-node';

export class MinHeightNode extends FeatureNode {

  constructor(minHeight: number) {
    super('min-height', minHeight);
  }

  public toJS(): string {
    return `height >= ${this.value}`;
  }
}