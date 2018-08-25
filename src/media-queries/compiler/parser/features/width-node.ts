import { FeatureNode } from './feature-node';

export class WidthNode extends FeatureNode {

  constructor(width: number) {
    super('width', width);
  }

  public toJS(): string {
    return `width === ${this.value}`;
  }
}