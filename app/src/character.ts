import { Accuracy, Damage, Experience, Health, Range } from './helper/type';
import { MinMax } from './helper/interfaces';

export abstract class CharacterBase {
  constructor(
    protected _health: Health,
    protected _damage: MinMax,
    protected _accuracy: Accuracy,
    protected _experience: Experience,
    protected _awarenessRange: Range
  ) {}

  /**
   *  The health of the character
   */
  public get health(): Health {
    return this._health;
  }
  public set health(value: Health) {
    this._health = value;
  }

  /**
   * The damage that the character causes without modifiers.
   */
  public get damage(): MinMax {
    return this._damage;
  }
  public set damage(value: MinMax) {
    this._damage = value;
  }

  /**
   * Number in Percentage. How accurate the monster hits.
   * 100 means it always hits.
   * 0 means it never hits.
   */
  public get accuracy(): Accuracy {
    return this._accuracy;
  }
  public set accuracy(value: Accuracy) {
    this._accuracy = value;
  }

  /**
   * The gathered experiece.
   */
  public get experience(): Experience {
    return this._experience;
  }
  public set experience(value: Experience) {
    this._experience = value;
  }

  /**
   * The distance from where on the character starts recognising other characters.
   */
  public get awarenessRange(): Range {
    return this._awarenessRange;
  }
  public set awarenessRange(value: Range) {
    this._awarenessRange = value;
  }
}
