import {
  savedata,
  moduleChances,
  getModuleNameByIndex,
  effects
} from "../data/index.js";
import elements from "../data/elements.js";

import Decimal from "../../lib/decimal.min.js";
import notation from "../../util/notation.js";

export function prestigeReset() {
  savedata.prestigeTime = 0;
  savedata.boughtUpgrades = savedata.boughtUpgrades.map(v => v = []);
  savedata.autobuyCharge = 0;
  savedata.gold = Decimal(0);
}

function getPrestigeGain() {
  return effects.prestigeGain;
}
function getModuleGain() {
  return savedata.prestige;
}

elements.prestige.button.addEventListener("click", () => {
  const prestigeGain = getPrestigeGain();
  if (
    prestigeGain.eq(0) &&
    !window.confirm("Are you sure to perform prestige with 0 prestige?")
  ) return;

  const moduleGain = getModuleGain();
  savedata.prestige = prestigeGain;
  /** @type {Decimal[]} */
  const modulesGot = moduleChances.map(chance => chance.mul(moduleGain).round());
  for (let i = 0; i < modulesGot.length; i++) {
    const moduleName = getModuleNameByIndex(i);
    if (
      modulesGot[i].lt(1) ||
      typeof savedata.modules[moduleName] === "undefined"
    ) continue;
    savedata.modules[moduleName].exp = savedata.modules[moduleName].exp.add(modulesGot[i]);
    if (savedata.modules[moduleName].tier === -1) savedata.modules[moduleName].tier = 0;
  }

  prestigeReset();
});

/**
 * @param {number} dt 
 */
function render(dt) {
  elements.prestige.info.prevPrestige.innerText = notation(savedata.prestige);
  elements.prestige.info.nextPrestige.innerText = notation(getPrestigeGain());
  elements.prestige.info.nextModule.innerText = notation(getModuleGain());
}

/**
 * @param {number} dt 
 */
function update(dt) {
  if (savedata.watchingTab === "prestige") render(dt);
}

export default update;
