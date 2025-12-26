export class StorageService {
  key_prefix = 'tw_';
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
}