"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storageService_1 = require("../shared/services/storageService");
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
    const storageService = new storageService_1.StorageService();
    storageService.setItem("autoScavengeActive", true);
}
autoScavenge();
