import { FeatureNode } from './feature-node';

export class MinWidthNode extends FeatureNode {

  constructor(minWidth: number) {
    super('min-width', minWidth);
  }

  public toJS(): string {
    return `width >= ${this.value}`;
  }
}