import { FeatureNode } from './feature-node';

export class MaxHeightNode extends FeatureNode {

  constructor(maxHeight: number) {
    super('max-height', maxHeight);
  }

  public toJS(): string {
    return `height <= ${this.value}`;
  }
}