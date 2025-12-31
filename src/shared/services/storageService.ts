export class StorageService {
  private readonly key_prefix: string = 'twscripts_';
  private storage: Storage;
  
  constructor() {
    this.storage = window.localStorage;
  }

  setItem(key: string, value: any) {
    this.storage.setItem(this.key_prefix + key, JSON.stringify(value));
  }

  getItem(key: string) {
    const item = this.storage.getItem(this.key_prefix + key);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key: string) {
    this.storage.removeItem(this.key_prefix + key);
  }

  hasItem(key: string): boolean {
    return this.storage.getItem(this.key_prefix + key) !== null;
  }
}