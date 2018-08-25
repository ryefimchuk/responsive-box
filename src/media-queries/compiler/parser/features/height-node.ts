import { FeatureNode } from './feature-node';

export class HeightNode extends FeatureNode {

  constructor(height: number) {
    super('height', height);
  }

  public toJS(): string {
    return `height === ${this.value}`;
  }
}