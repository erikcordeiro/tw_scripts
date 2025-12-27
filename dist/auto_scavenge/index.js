/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/shared/services/storageService.ts
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

;// ./src/auto_scavenge/tw_auto_scavenge.ts

// Script de automação de coleta para o jogo Tribal Wars
// Autor: Éric N. Cordeiro
// Data: 27 de junho de 2024
// Versão: 1.0
// Descrição: Este script realiza automações de coleta no jogo Tribal Wars.
// Função principal de automação de coleta
function autoScavenge() {
    scavenge();
}
// Função para realizar a coleta
function scavenge() {
    UI.SuccessMessage("Iniciando a coleta automática...");
    const storageService = new StorageService();
    storageService.setItem("autoScavengeActive", true);
}
autoScavenge();

;// ./src/auto_scavenge/index.ts


/******/ })()
;