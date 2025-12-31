/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/shared/services/storageService.ts
class StorageService {
    constructor() {
        this.key_prefix = 'twscripts_';
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
    hasItem(key) {
        return this.storage.getItem(this.key_prefix + key) !== null;
    }
}

;// ./src/auto_scavenge/tw_auto_scavenge.ts
// Script de automação de coleta para o jogo Tribal Wars
// Autor: Éric N. Cordeiro
// Data: 27 de junho de 2024
// Versão: 1.0
// Descrição: Este script realiza automações de coleta no jogo Tribal Wars.

const storageService = new StorageService();
const scavengeOptions = {};
const unitAmounts = {
    spears: 0,
    swords: 0,
    axes: 0,
    lightC: 0,
    heavyC: 0,
    archer: 0,
    marcher: 0,
};
let haulCategory = 0;
let hours = 6;
let totalLoot;
let totalSpSwLoot;
let possibleLoot;
let spearRatio;
let swordRatio;
let totalHaul;
let haul1;
let haul2;
let haul3;
let haul4;
// Função principal de automação de coleta
function autoScavenge() {
    // Checa se estamos na tela de coleta
    if (isScavengeScreen()) {
        const checkScavengeScreen = setInterval(() => {
            if (typeof ScavengeScreen !== 'undefined') {
                clearInterval(checkScavengeScreen);
                scavenge();
            }
            else {
                console.log("ScavengeScreen não está definido ainda.");
            }
        }, 100); // Verifica a cada 100ms
    }
    else {
        // TODO: Executar a coleta em segundo plano.
    }
}
// Função para realizar a coleta
function scavenge() {
    if ($("button").length == 0) {
        // Cria a interface de usuário para ajuste do tempo de coleta.
        createInterface();
    }
    if ($(".scavengeTable")[0]) {
        $("#hours").val(getScavTime());
    }
    const checkboxValues = JSON.parse(storageService.getItem("checkboxValues")) || {}, $checkboxes = $("#scavTable :checkbox");
    $checkboxes.on("change", function () {
        $checkboxes.each(function () {
            checkboxValues[this.id] = this.checked;
        });
        storageService.setItem("checkboxValues", JSON.stringify(checkboxValues));
        calculateHauls();
        let haulCategory = 0;
        storageService.setItem("haulCategory", haulCategory);
        scavenge();
    });
    $.each(checkboxValues, function (key, value) {
        $(`#${key}`).prop("checked", value);
    });
    unitAmounts.spears = parseInt($(".units-entry-all[data-unit=spear]")
        .text()
        .match(/\((\d+)\)/)?.[1] ?? "0");
    unitAmounts.swords = parseInt($(".units-entry-all[data-unit=sword]")
        .text()
        .match(/\((\d+)\)/)?.[1] ?? "0");
    unitAmounts.axes = parseInt($(".units-entry-all[data-unit=axe]")
        .text()
        .match(/\((\d+)\)/)?.[1] ?? "0");
    unitAmounts.lightC = parseInt($(".units-entry-all[data-unit=light]")
        .text()
        .match(/\((\d+)\)/)?.[1] ?? "0");
    unitAmounts.heavyC = parseInt($(".units-entry-all[data-unit=heavy]")
        .text()
        .match(/\((\d+)\)/)?.[1] ?? "0");
    unitAmounts.archer = isArcherUnitEnabled()
        ? parseInt($(".units-entry-all[data-unit=archer]")
            .text()
            .match(/\((\d+)\)/)?.[1] ?? "0")
        : 0;
    unitAmounts.marcher = isMountedArcherUnitEnabled()
        ? parseInt($(".units-entry-all[data-unit=marcher]")
            .text()
            .match(/\((\d+)\)/)?.[1] ?? "0")
        : 0;
    if ($(".scavengeTable").length) {
        checkboxStatus();
    }
    calculateHauls();
    if (storageService.hasItem("haulCategory")) {
        haulCategory = parseInt(storageService.getItem("haulCategory"));
    }
    else {
        haulCategory = 0;
        storageService.setItem("haulCategory", haulCategory);
    }
    if (totalLoot > totalHaul) {
        if (totalSpSwLoot > totalHaul) {
            if (haulCategory == 0) {
                haulCategory = 1;
                storageService.setItem("haulCategory", haulCategory);
            }
        }
        else {
            if (haulCategory == 0) {
                haulCategory = 2;
                storageService.setItem("haulCategory", haulCategory);
            }
        }
    }
    else {
        if (haulCategory == 0) {
            haulCategory = 3;
            storageService.setItem("haulCategory", haulCategory);
        }
    }
    const lackadaisicalLooters = $(".title")[0].innerHTML;
    const humbleHaulers = $(".title")[1].innerHTML;
    const cleverCollectors = $(".title")[2].innerHTML;
    const greatGatherers = $(".title")[3].innerHTML;
    if (haulCategory == 1) {
        scavengeOptions[greatGatherers] = [
            {
                type: "spear",
                count: haul4 * spearRatio,
            },
            {
                type: "sword",
                count: haul4 * swordRatio,
            },
            {
                type: "axe",
                count: 0,
            },
            {
                type: "archer",
                count: 0,
            },
            {
                type: "light",
                count: 0,
            },
            {
                type: "marcher",
                count: 0,
            },
            {
                type: "heavy",
                count: 0,
            },
        ];
        scavengeOptions[cleverCollectors] = [
            {
                type: "spear",
                count: haul3 * spearRatio,
            },
            {
                type: "sword",
                count: haul3 * swordRatio,
            },
            {
                type: "axe",
                count: 0,
            },
            {
                type: "archer",
                count: 0,
            },
            {
                type: "light",
                count: 0,
            },
            {
                type: "marcher",
                count: 0,
            },
            {
                type: "heavy",
                count: 0,
            },
        ];
        scavengeOptions[humbleHaulers] = [
            {
                type: "spear",
                count: haul2 * spearRatio,
            },
            {
                type: "sword",
                count: haul2 * swordRatio,
            },
            {
                type: "axe",
                count: 0,
            },
            {
                type: "archer",
                count: 0,
            },
            {
                type: "light",
                count: 0,
            },
            {
                type: "marcher",
                count: 0,
            },
            {
                type: "heavy",
                count: 0,
            },
        ];
        scavengeOptions[lackadaisicalLooters] = [
            {
                type: "spear",
                count: haul1 * spearRatio,
            },
            {
                type: "sword",
                count: haul1 * swordRatio,
            },
            {
                type: "axe",
                count: 0,
            },
            {
                type: "archer",
                count: 0,
            },
            {
                type: "light",
                count: 0,
            },
            {
                type: "marcher",
                count: 0,
            },
            {
                type: "heavy",
                count: 0,
            },
        ];
    }
    else {
        if (haulCategory == 2) {
            scavengeOptions[greatGatherers] = [
                {
                    type: "spear",
                    count: haul4 * (unitAmounts.spears / possibleLoot),
                },
                {
                    type: "sword",
                    count: haul4 * (unitAmounts.swords / possibleLoot),
                },
                {
                    type: "axe",
                    count: haul4 * (unitAmounts.axes / possibleLoot),
                },
                {
                    type: "light",
                    count: haul4 * (unitAmounts.lightC / possibleLoot),
                },
                {
                    type: "heavy",
                    count: haul4 * (unitAmounts.heavyC / possibleLoot),
                },
                {
                    type: "archer",
                    count: haul4 * (unitAmounts.archer / possibleLoot),
                },
                {
                    type: "marcher",
                    count: haul4 * (unitAmounts.marcher / possibleLoot),
                },
            ];
            scavengeOptions[cleverCollectors] = [
                {
                    type: "spear",
                    count: haul3 * (unitAmounts.spears / possibleLoot),
                },
                {
                    type: "sword",
                    count: haul3 * (unitAmounts.swords / possibleLoot),
                },
                {
                    type: "axe",
                    count: haul3 * (unitAmounts.axes / possibleLoot),
                },
                {
                    type: "light",
                    count: haul3 * (unitAmounts.lightC / possibleLoot),
                },
                {
                    type: "heavy",
                    count: haul3 * (unitAmounts.heavyC / possibleLoot),
                },
                {
                    type: "archer",
                    count: haul3 * (unitAmounts.archer / possibleLoot),
                },
                {
                    type: "marcher",
                    count: haul3 * (unitAmounts.marcher / possibleLoot),
                },
            ];
            scavengeOptions[humbleHaulers] = [
                {
                    type: "spear",
                    count: haul2 * (unitAmounts.spears / possibleLoot),
                },
                {
                    type: "sword",
                    count: haul2 * (unitAmounts.swords / possibleLoot),
                },
                {
                    type: "axe",
                    count: haul2 * (unitAmounts.axes / possibleLoot),
                },
                {
                    type: "light",
                    count: haul2 * (unitAmounts.lightC / possibleLoot),
                },
                {
                    type: "heavy",
                    count: haul2 * (unitAmounts.heavyC / possibleLoot),
                },
                {
                    type: "archer",
                    count: haul2 * (unitAmounts.archer / possibleLoot),
                },
                {
                    type: "marcher",
                    count: haul2 * (unitAmounts.marcher / possibleLoot),
                },
            ];
            scavengeOptions[lackadaisicalLooters] = [
                {
                    type: "spear",
                    count: haul1 * (unitAmounts.spears / possibleLoot),
                },
                {
                    type: "sword",
                    count: haul1 * (unitAmounts.swords / possibleLoot),
                },
                {
                    type: "axe",
                    count: haul1 * (unitAmounts.axes / possibleLoot),
                },
                {
                    type: "light",
                    count: haul1 * (unitAmounts.lightC / possibleLoot),
                },
                {
                    type: "heavy",
                    count: haul1 * (unitAmounts.heavyC / possibleLoot),
                },
                {
                    type: "archer",
                    count: haul1 * (unitAmounts.archer / possibleLoot),
                },
                {
                    type: "marcher",
                    count: haul1 * (unitAmounts.marcher / possibleLoot),
                },
            ];
        }
        else {
            if (haulCategory == 3) {
                scavengeOptions[greatGatherers] = [
                    {
                        type: "spear",
                        count: (totalLoot / totalHaul) * haul4 * (unitAmounts.spears / possibleLoot),
                    },
                    {
                        type: "sword",
                        count: (totalLoot / totalHaul) * haul4 * (unitAmounts.swords / possibleLoot),
                    },
                    {
                        type: "axe",
                        count: (totalLoot / totalHaul) * haul4 * (unitAmounts.axes / possibleLoot),
                    },
                    {
                        type: "light",
                        count: (totalLoot / totalHaul) * haul4 * (unitAmounts.lightC / possibleLoot),
                    },
                    {
                        type: "heavy",
                        count: (totalLoot / totalHaul) * haul4 * (unitAmounts.heavyC / possibleLoot),
                    },
                    {
                        type: "archer",
                        count: (totalLoot / totalHaul) * haul4 * (unitAmounts.archer / possibleLoot),
                    },
                    {
                        type: "marcher",
                        count: (totalLoot / totalHaul) * haul4 * (unitAmounts.marcher / possibleLoot),
                    },
                ];
                scavengeOptions[cleverCollectors] = [
                    {
                        type: "spear",
                        count: (totalLoot / (totalHaul - haul4)) * haul3 * (unitAmounts.spears / possibleLoot),
                    },
                    {
                        type: "sword",
                        count: (totalLoot / (totalHaul - haul4)) * haul3 * (unitAmounts.swords / possibleLoot),
                    },
                    {
                        type: "axe",
                        count: (totalLoot / (totalHaul - haul4)) * haul3 * (unitAmounts.axes / possibleLoot),
                    },
                    {
                        type: "light",
                        count: (totalLoot / (totalHaul - haul4)) * haul3 * (unitAmounts.lightC / possibleLoot),
                    },
                    {
                        type: "heavy",
                        count: (totalLoot / (totalHaul - haul4)) * haul3 * (unitAmounts.heavyC / possibleLoot),
                    },
                    {
                        type: "archer",
                        count: (totalLoot / (totalHaul - haul4)) * haul3 * (unitAmounts.archer / possibleLoot),
                    },
                    {
                        type: "marcher",
                        count: (totalLoot / (totalHaul - haul4)) * haul3 * (unitAmounts.marcher / possibleLoot),
                    },
                ];
                scavengeOptions[humbleHaulers] = [
                    {
                        type: "spear",
                        count: (totalLoot / (totalHaul - haul4 - haul3)) * haul2 * (unitAmounts.spears / possibleLoot),
                    },
                    {
                        type: "sword",
                        count: (totalLoot / (totalHaul - haul4 - haul3)) * haul2 * (unitAmounts.swords / possibleLoot),
                    },
                    {
                        type: "axe",
                        count: (totalLoot / (totalHaul - haul4 - haul3)) * haul2 * (unitAmounts.axes / possibleLoot),
                    },
                    {
                        type: "light",
                        count: (totalLoot / (totalHaul - haul4 - haul3)) * haul2 * (unitAmounts.lightC / possibleLoot),
                    },
                    {
                        type: "heavy",
                        count: (totalLoot / (totalHaul - haul4 - haul3)) * haul2 * (unitAmounts.heavyC / possibleLoot),
                    },
                    {
                        type: "archer",
                        count: (totalLoot / (totalHaul - haul4 - haul3)) * haul2 * (unitAmounts.archer / possibleLoot),
                    },
                    {
                        type: "marcher",
                        count: (totalLoot / (totalHaul - haul4 - haul3)) * haul2 * (unitAmounts.marcher / possibleLoot),
                    },
                ];
                scavengeOptions[lackadaisicalLooters] = [
                    {
                        type: "spear",
                        count: totalLoot * (unitAmounts.spears / possibleLoot),
                    },
                    {
                        type: "sword",
                        count: totalLoot * (unitAmounts.swords / possibleLoot),
                    },
                    {
                        type: "axe",
                        count: totalLoot * (unitAmounts.axes / possibleLoot),
                    },
                    {
                        type: "light",
                        count: totalLoot * (unitAmounts.lightC / possibleLoot),
                    },
                    {
                        type: "heavy",
                        count: totalLoot * (unitAmounts.heavyC / possibleLoot),
                    },
                    {
                        type: "archer",
                        count: totalLoot * (unitAmounts.archer / possibleLoot),
                    },
                    {
                        type: "marcher",
                        count: totalLoot * (unitAmounts.marcher / possibleLoot),
                    },
                ];
            }
        }
    }
    run();
}
function isScavengeScreen() {
    return window.location.href.indexOf("screen=place&mode=scavenge") >= 0;
}
function createInterface() {
    haulCategory = 0;
    storageService.setItem("haulCategory", haulCategory);
    const button = document.createElement("button");
    button.classList.add("btn", "btn-confirm-yes");
    button.innerHTML = "Ajuste o tempo de coleta";
    button.style.visibility = "hidden";
    const body = $("#scavenge_screen");
    body.prepend(button);
    const scavDiv = document.createElement("div");
    // Verifica se é um mundo de arqueiros ou não, dependendo do resultado, cria uma tabela com ou sem arqueiros.
    const tableHtml = createScavengeTable();
    for (let i = 0; i < $(".border-frame-gold-red").length; i++) {
        const cat = document.createElement("div");
        cat.innerHTML =
            '<div align="center"><h3>Enable</h3><input type="checkbox" ID="haul' +
                (i + 1) +
                'Enabled" name="haul' +
                (i + 1) +
                'Enabled" ><hr></div>';
        $(".border-frame-gold-red")[i].prepend(cat);
    }
    scavDiv.innerHTML = tableHtml;
    body.prepend(scavDiv);
    haulCategory = 0;
    storageService.setItem("haulCategory", haulCategory);
    hours = getScavTime();
    $("#hours").val(hours);
    $("#hours").on("change", function () {
        const inputHours = parseInt($("#hours").val());
        storageService.setItem("ScavengeTime", inputHours);
        haulCategory = 0;
        storageService.setItem("haulCategory", haulCategory);
        calculateHauls();
        clear();
        getScavTime();
        $("#hours").trigger("focus");
    });
}
function getScavTime() {
    let hoursTemp;
    // Verifica se a duração já está configurada
    if (storageService.hasItem("ScavengeTime")) {
        hoursTemp = parseInt(storageService.getItem("ScavengeTime"));
    }
    else {
        hoursTemp = 6;
        storageService.setItem("ScavengeTime", hoursTemp);
    }
    return hoursTemp;
}
function isArcherUnitEnabled() {
    return game_data.units.includes("archer");
}
function isMountedArcherUnitEnabled() {
    return game_data.units.includes("marcher");
}
function createScavengeTable() {
    const graficBaseUrl = "https://dsen.innogamescdn.com/asset/cf2959e7/graphic";
    const frameGoldRedBorderImgUrl = `${graficBaseUrl}/border/frame_gold_red.png`;
    const spearImgUrl = `${graficBaseUrl}/unit/unit_spear.png`;
    const swordImgUrl = `${graficBaseUrl}/unit/unit_sword.png`;
    const axeImgUrl = `${graficBaseUrl}/unit/unit_axe.png`;
    const archerImgUrl = `${graficBaseUrl}/unit/unit_archer.png`;
    const lightCavalryImgUrl = `${graficBaseUrl}/unit/unit_light.png`;
    const mountedArcherImgUrl = `${graficBaseUrl}/unit/unit_marcher.png`;
    const heavyCavalryImgUrl = `${graficBaseUrl}/unit/unit_heavy.png`;
    let htmlString = `
  <div id="scavTable">
    <table class="scavengeTable" width="15%" style="border: 1px solid rgba(121,0,0,0.71); border-image-slice: 7 7 7 7; border-image-source: url(${frameGoldRedBorderImgUrl});">
      <tbody>
        <tr>
          <th style="text-align:center" colspan="13">Selecione o tipo de unidade para coletar</th>
        </tr>
        <tr>
          <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="spear"><img src="${spearImgUrl}" title="Spear fighter" alt="" class=""></a></th>
          <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="sword"><img src="${swordImgUrl}" title="Swordsman" alt="" class=""></a></th>
          <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="axe"><img src="${axeImgUrl}" title="Axeman" alt="" class=""></a></th>
          ${isArcherUnitEnabled()
        ? `<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="archer"><img src="${archerImgUrl}" title="Archer" alt="" class=""></a></th>`
        : ""}
          <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="light"><img src="${lightCavalryImgUrl}" title="Light cavalry" alt="" class=""></a></th>
          ${isMountedArcherUnitEnabled()
        ? `<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="marcher"><img src="${mountedArcherImgUrl}" title="Mounted Archer" alt="" class=""></a></th>`
        : ""}
          <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="heavy"><img src="${heavyCavalryImgUrl}" title="Heavy cavalry" alt="" class=""></a></th>
          <th style="text-align:center" nowrap>Tempo alvo</th>
        </tr>
        <tr>
          <td align="center"><input type="checkbox" id="spear" name="spear" checked = "checked"></td>
          <td align="center"><input type="checkbox" id="sword" name="sword"></td>
          <td align="center"><input type="checkbox" id="axe" name="axe"></td>
          ${isArcherUnitEnabled()
        ? `<td align="center"><input type="checkbox" id="archer" name="archer"></td>`
        : ""}
          <td align="center"><input type="checkbox" id="light" name="light"></td>
          ${isMountedArcherUnitEnabled()
        ? `<td align="center"><input type="checkbox" id="marcher" name="marcher"></td>`
        : ""}
          <td align="center"><input type="checkbox" id="heavy" name="heavy"></td>
          <td id="runtime" align="center"><input type="text" id="hours" name="hours" size="4" maxlength="5" align="left"> horas</td>
        </tr>
      </tbody>
    </table>
    </ br>
  </div>`;
    return htmlString;
}
function checkboxStatus() {
    if (!$("#spear").prop("checked")) {
        unitAmounts.spears = 0;
        // haulcategory = 0;
    }
    if (!$("#sword").prop("checked")) {
        unitAmounts.swords = 0;
        // haulcategory = 0;
    }
    if (!$("#axe").prop("checked")) {
        unitAmounts.axes = 0;
        // haulcategory = 0;
    }
    if (!$("#light").prop("checked")) {
        unitAmounts.lightC = 0;
        // haulcategory = 0;
    }
    if (!$("#heavy").prop("checked")) {
        unitAmounts.heavyC = 0;
        // haulcategory = 0;
    }
    if (isArcherUnitEnabled()) {
        if (!$("#archer").prop("checked")) {
            unitAmounts.archer = 0;
            // haulcategory = 0;
        }
    }
    if (isMountedArcherUnitEnabled()) {
        if (!$("#marcher").prop("checked")) {
            unitAmounts.marcher = 0;
            // haulcategory = 0;
        }
    }
}
function calculateHauls() {
    const duration_factor = ScavengeScreen?.village.options[1].base.duration_factor ?? 0;
    const duration_exponent = ScavengeScreen?.village.options[1].base.duration_exponent ?? 0;
    const duration_initial_seconds = ScavengeScreen?.village.options[1].base.duration_initial_seconds ?? 0;
    checkboxStatus();
    totalLoot =
        unitAmounts.spears * 25 +
            unitAmounts.swords * 15 +
            unitAmounts.axes * 10 +
            unitAmounts.lightC * 80 +
            unitAmounts.heavyC * 50 +
            unitAmounts.archer * 10 +
            unitAmounts.marcher * 50;
    totalSpSwLoot = unitAmounts.spears * 25 + unitAmounts.swords * 15;
    possibleLoot =
        unitAmounts.spears * 25 +
            unitAmounts.swords * 15 +
            unitAmounts.axes * 10 +
            unitAmounts.lightC * 80 +
            unitAmounts.heavyC * 50 +
            unitAmounts.archer * 10 +
            unitAmounts.marcher * 50;
    spearRatio = unitAmounts.spears / (unitAmounts.spears * 25 + unitAmounts.swords * 15);
    swordRatio = unitAmounts.swords / (unitAmounts.spears * 25 + unitAmounts.swords * 15);
    const hours = getScavTime();
    let time = hours * 3600;
    let haul = ((time / duration_factor - duration_initial_seconds) ** (1 / duration_exponent) / 100) ** (1 / 2);
    haul1 = haul / 0.1;
    haul2 = haul / 0.25;
    haul3 = haul / 0.5;
    haul4 = haul / 0.75;
    totalHaul = haul1 + haul2 + haul3 + haul4;
}
function run() {
    let btn = null;
    for (const option in scavengeOptions) {
        btn = findNextButton(option);
        if (btn) {
            fillInTroops(option, getAvailableUnits(), btn);
            break;
        }
    }
}
function clear() {
    let btn = null;
    for (const option in scavengeOptions) {
        btn = findNextButton(option);
        if (!btn) {
            emptyTroops(option);
            break;
        }
    }
}
function fillInTroops(option, availableUnits, button) {
    scavengeOptions[option].forEach(units => {
        const type = units.type;
        const count = units.count;
        let requiredCapacity = availableUnits[type] < count ? availableUnits[type] : count;
        $(`input.unitsInput[name='${type}']`).val(requiredCapacity).trigger("change");
        $(button).trigger('focus');
    });
}
function emptyTroops(option) {
    scavengeOptions[option].forEach(units => {
        const type = units.type;
        $(`input.unitsInput[name='${type}']`).val("").trigger("change");
    });
}
function findNextButton(option) {
    const startButtonName = document.getElementsByClassName("btn btn-default free_send_button")[0].innerHTML;
    let btn = $(`.scavenge-option:contains("${option}")`).find('a:contains(' + startButtonName + ')');
    if (btn.length > 0 && !$(btn).hasClass('btn-disabled'))
        return btn;
}
function getAvailableUnits() {
    let availableUnits = {};
    $('.units-entry-all').each((i, e) => {
        const unitName = $(e).attr("data-unit");
        const count = $(e).text().replace(/[()]/, '');
        availableUnits[unitName] = parseInt(count);
    });
    return availableUnits;
}
autoScavenge();

;// ./src/auto_scavenge/index.ts


/******/ })()
;