import { UPGRADE_LEVEL_LIMIT as upgradeLevelLimit } from "../../class/UpgradeGenerator.js";
import {
  getModuleByIndex,
  getModuleByName,
  upgradeEffects,
  effects,
  elements,
  savedata
} from "../data/index.js";
import { prestigeReset } from "./prestige.js";

import Decimal from "../../lib/decimal.min.js";
import notation from "../../util/notation.js";
import roman from "../../util/roman.js";

/** @type {import("../../class/UpgradeGenerator.js").default} */
let selectedModule = null;
let selectedPreviewLevel = 0;
function selectModule(idx) {
  idx = Number(idx);

  if (idx !== selectedModule?.index) {
    const module = getModuleByIndex(idx);
    if (module === null) return;
    const moduleSavedata = savedata.modules[module.name];
    if (moduleSavedata.tier < 0) return;
    selectedModule = module;
    elements.modules.selected.element.style.display = "";
    elements.modules.selected.element.style.setProperty("--color", selectedModule.color);
  } else {
    elements.modules.selected.element.style.display = "none";
    selectedModule = null;
  }
}
for (let i = 0; i < elements.modules.grid.length; i++) {
  elements.modules.grid[i].element.addEventListener("click", function() {
    selectModule(this.dataset.index);
  });
}
/**
 * @param {number} n 
 */
function chancePreviewLevel(n) {
  selectedPreviewLevel += n;
  selectedPreviewLevel = Math.max(0, Math.min(upgradeLevelLimit - 1 , selectedPreviewLevel));
}
elements.modules.selected.effect.level.next.addEventListener("click", () => chancePreviewLevel(1));
elements.modules.selected.effect.level.prev.addEventListener("click", () => chancePreviewLevel(-1));
function canEquip() {
  return !(
    selectedModule === null ||
    savedata.selectedUpgrades.includes(selectedModule.name) ||
    effects.maxModule.toNumber() <= savedata.selectedUpgrades.length
  )
}
elements.modules.selected.button.equip.addEventListener("click", () => {
  if (!canEquip()) return;
  savedata.selectedUpgrades.push(selectedModule.name);
});
elements.modules.selected.button.upgrade.addEventListener("click", () => {
  if (canBuyUpgrade()) {
    savedata.modules[selectedModule.name].tier++;
  }
});
elements.modules.upgrader.button.respec.addEventListener("click", () => {
  if (!window.confirm("Are you sure to respec Module/Upgraders?")) return;
  for (const moduleName in savedata.modules) {
    savedata.modules[moduleName].tier = Math.min(savedata.modules[moduleName].tier, 0);
  }
  savedata.selectedUpgrades = [];
  prestigeReset();
});
function calculateUpgraderCost() {
  return new Decimal(2+savedata.upgraders/10).pow((savedata.upgraders+1)**1.2).floor();
}
elements.modules.upgrader.button.buy.addEventListener("click", () => {
  const cost = calculateUpgraderCost();
  if (savedata.prestige.gt(cost)) {
    savedata.prestige = savedata.prestige.sub(cost);
    savedata.upgraders += 1;
  }
});

function calculateExpReq(tier) {
  return new Decimal(2+tier**1.2).pow(tier+1).floor();
}
function getUsedUpgrader() {
  let used = 0;
  for (const moduleName in savedata.modules) {
    used += Math.max(0, savedata.modules[moduleName].tier);
  }
  return used;
}
function getUpgrader() {
  return savedata.upgraders - getUsedUpgrader();
}
function canBuyUpgrade() {
  if (selectedModule === null) return false;
  /** @type {savedata["modules"][keyof savedata["modules"]]} */
  const moduleSave = savedata.modules[selectedModule.name];
  const expReq = calculateExpReq(moduleSave.tier);
  if (
    moduleSave.exp.gte(expReq) &&
    getUpgrader() >= 1
  ) {
    return true;
  }
  return false;
}

/**
 * @param {number} dt 
 */
function render(dt) {
  /** @type {number[]} */
  let expReq = [];
  /** @type {number[]} */
  let expProgress = [];

  elements.modules.upgrader.button.buy.innerText = notation(calculateUpgraderCost());
  elements.modules.upgrader.value.innerText = getUpgrader() + "/" + savedata.upgraders

  for (let i = 0; i < elements.modules.grid.length; i++) {
    const module = getModuleByIndex(i);
    if (typeof module === "undefined") continue;
    /** @type {import("../data/modules.js").ModuleTypes} */
    const moduleName = module.name;
    const moduleIndex = module.index;
    const moduleSavedata = savedata.modules[moduleName];
    const element = elements.modules.grid[i];
    
    element.element.classList[savedata.selectedUpgrades.includes(moduleName) ? "add" : "remove"]("equip");
    if (moduleSavedata.tier >= 0) {
      element.element.classList.remove("locked");
      element.tier.innerText = moduleSavedata.tier;
      expReq[moduleIndex] = calculateExpReq(moduleSavedata.tier);
      expProgress[moduleIndex] = Math.min(1, moduleSavedata.exp.div(expReq[moduleIndex]).toNumber());
      element.exp.innerText = Math.floor(expProgress[moduleIndex]*100) + "%";
    } else {
      element.element.classList.add("locked");
    }
  }

  if (selectedModule !== null) {
    /** @type {import("../upgradeGenerators.js").UpgradeGeneratorType} */
    const moduleName = selectedModule.name;
    const module = getModuleByName(moduleName);
    const moduleSavedata = savedata.modules[moduleName];
    const element = elements.modules.selected;

    element.name.innerText = selectedModule.name;

    element.effect.level.value.innerText = roman(selectedPreviewLevel+1);

    const upgrade = module.getUpgrades(
      moduleSavedata.tier,
      Array.from({ length: selectedPreviewLevel }, (_, i) => i),
      savedata,
      1
    )[0];
    const effects = module.getUpgradeEffect(
      moduleSavedata.tier,
      selectedPreviewLevel,
      savedata
    );
    element.effect.cost.innerText = notation(upgrade.cost);
    for (let i = 0; i < element.effect.list.length; i++) {
      const effectElement = element.effect.list[i];
      const effectData = effects[i];
      if (typeof effectData === "undefined") {
        effectElement.element.style.display = "none";
        continue;
      }
      /** @type {import("../../class/UpgradeEffects.js").EffectData} */
      const effect = upgradeEffects.effectsDatas[effectData.name];
      effectElement.element.style.display = "";
      effectElement.name.innerText = effect.display.name;
      effectElement.name.style.color = effect.display.color;
      effectElement.value.innerText = effect.display.operator + " " + notation(effectData.value);
    }

    element.data.tier.innerText = moduleSavedata.tier;
    element.data.exp.style.setProperty("--progress", expProgress[module.index]*100 + "%");
    element.data.expText.innerText = notation(moduleSavedata.exp) + "/" + notation(expReq[module.index]);

    element.button.equip.classList[!canEquip() ? "add" : "remove"]("equiped");
    element.button.upgrade.classList[canBuyUpgrade() ? "add" : "remove"]("can-upgrade");
  }
}

/**
 * @param {number} dt 
 */
function update(dt) {
  if (savedata.watchingTab === "modules") render(dt);
}

export default update;
