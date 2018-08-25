import { FeatureNode } from './feature-node';

export class MaxWidthNode extends FeatureNode {

  constructor(maxWidth: number) {
    super('max-width', maxWidth);
  }

  public toJS(): string {
    return `width <= ${this.value}`;
  }
}