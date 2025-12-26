"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
class StorageService {
    constructor() {
        this.key_prefix = 'tw_';
        this.storage = window.localStorage;
    }
    setItem(key, value) {
        this.storage.setItem(this.key_prefix + key, JSON.stringify(value));
    }
    getItem(key) {
        const item = this.storage.getItem(this.key_prefix + key);
        return item ? JSON.parse(item) : null;
    }
    removeItem(key) {
        this.storage.removeItem(this.key_prefix + key);
    }
}
exports.StorageService = StorageService;
