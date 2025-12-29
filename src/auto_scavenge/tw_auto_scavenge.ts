import { UI, GameData } from "../shared/types/tw";
import { StorageService } from "../shared/services/storageService";

declare const UI: UI;
declare const game_data: GameData;

// Script de automação de coleta para o jogo Tribal Wars
// Autor: Éric N. Cordeiro
// Data: 27 de junho de 2024
// Versão: 1.0
// Descrição: Este script realiza automações de coleta no jogo Tribal Wars.

// Função principal de automação de coleta
function autoScavenge() {
  if (game_data.screen === "scavenge") {
    scavenge();
  } else {
    UI.ErrorMessage("Este script só pode ser executado na tela de coleta.");
  }
}

// Função para realizar a coleta
function scavenge() {
  UI.SuccessMessage("Iniciando a coleta automática...");
  
  // const storageService = new StorageService();
  // storageService.setItem("autoScavengeActive", true);
}

autoScavenge();