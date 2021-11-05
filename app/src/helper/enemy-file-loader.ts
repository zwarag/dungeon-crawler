import enemiesJson from '../../public/txt/enemies.json';

export class EnemyFileLoader {
  private static file: Record<string, unknown>;

  static load(): Record<string, unknown> {
    if (!this.file) {
      this.file = enemiesJson;
      return enemiesJson;
    } else {
      return this.file;
    }
  }

  static update(file: Record<string, unknown>) {
    this.file = file;
  }
}
