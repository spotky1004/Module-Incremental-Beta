import { effectNameEnum as effect } from "./upgradeEffects.js";
import UpgradeGenerator from "../../class/UpgradeGenerator.js";

import Decimal from "../../lib/decimal.min.js";
import factroial from "../../util/factroial.js";

export const moduleEnum = {
  "Gold Mine": 0,
  "Gold Duplicator": 1,
  "Growth Boost": 2,
  "Decay Boost": 3,
  "Sacrifice": 4,

  "Prestige Gain": 6,
  
  "Autobuy": 30,
  "Extra Module": 31,
};
/**
 * @typedef {keyof typeof moduleEnum} ModuleTypes
 */

const modules = [
  new UpgradeGenerator({
    name: "Gold Mine",
    rarity: 0,
    index: moduleEnum["Gold Mine"],
    color: "#d4d41e",
    effects: {
      [effect.goldGain]: (tier, level, savedata) => Decimal(level+1).pow(1+tier/2)
    },
    cost: (tier, level, savedata) => Decimal(level+5).pow(3+Math.max(0, level/20)).div(25)
  }),
  new UpgradeGenerator({
    name: "Gold Duplicator",
    rarity: 1,
    index: moduleEnum["Gold Duplicator"],
    color: "#d1d194",
    effects: {
      [effect.goldGainMult]: (tier, level, savedata) => Decimal(3+(tier+1)*(level/4+1))
    },
    cost: (tier, level, savedata) => factroial(level).mul(Decimal((100+level*10)/(tier/3+1)).pow(level+1))
  }),
  new UpgradeGenerator({
    name: "Growth Boost",
    rarity: 3,
    index: moduleEnum["Growth Boost"],
    color: "#72e8a7",
    effects: {
      [effect.goldGainMult]: (tier, level, savedata) => Decimal(savedata.prestigeTime/1000/(20+level*10)).pow(0.5+tier/20).mul(1+level/2).add(1)
    },
    cost: (tier, level, savedata) => Decimal(1e4).pow(level+1).mul(100).mul(Decimal(savedata.prestigeTime/1000).pow(1/(tier+1)).add(1))
  }),
  new UpgradeGenerator({
    name: "Decay Boost",
    rarity: 2.5,
    index: moduleEnum["Decay Boost"],
    color: "#bd72e8",
    effects: {
      [effect.goldGainMult]: (tier, level, savedata) => Decimal((level+4)*(tier+1)).div(1+savedata.prestigeTime/1000/(100+level*50)).add(1)
    },
    cost: (tier, level, savedata) => Decimal(1e4).pow(level+1).mul(100).div(Decimal(savedata.prestigeTime/1000).pow(tier+1).add(1))
  }),
  new UpgradeGenerator({
    name: "Sacrifice",
    rarity: 4,
    index: moduleEnum["Sacrifice"],
    color: "#de3535",
    effects: {
      [effect.goldGain]: (tier, level, savedata) => Decimal(2+level+tier*2).pow(level+tier*2).mul(1e3),
      [effect.goldGainMult]: (tier, level, savedata) => Decimal(1-0.4/(tier/2+1))
    },
    cost: (tier, level, savedata) => Decimal(9).div(tier/6+1).add(1).pow(level**2).mul(1000)
  }),
  new UpgradeGenerator({
    name: "Prestige Gain",
    rarity: 3.5,
    index: moduleEnum["Prestige Gain"],
    color: "#78d3fa",
    effects: {
      [effect.prestigeGain]: (tier, level, savedata) => Decimal(level+1).pow(2+tier/6+level/3).floor()
    },
    cost: (tier, level, savedata) => Decimal(10).pow(level*(1+level/20)+3).div(Decimal(6).pow(tier))
  }),
  new UpgradeGenerator({
    name: "Autobuy",
    rarity: 3,
    index: moduleEnum["Autobuy"],
    color: "#67f0b2",
    effects: {
      [effect.autobuy]: (tier, level, savedata) => 0.01*(tier/2+1),
    },
    cost: (tier, level, savedata) => Decimal.max(1, Decimal(2*(level-tier))).pow(level).mul(1000).div(Decimal(2).pow(tier-level))
  }),
  new UpgradeGenerator({
    name: "Extra Module",
    rarity: 1.5,
    index: moduleEnum["Extra Module"],
    color: "#67f0db",
    effects: {
      [effect.maxModule]: (tier, level, savedata) => 0.11*Math.sqrt(tier+1),
    },
    cost: (tier, level, savedata) => Decimal.max(1, 10/(tier/3+1)).pow(Decimal(1.28).pow(level))
  }),
];

// make loot table
/** @type {Decimal[]} */
const chances = Array(36).fill().map((_, index) => {
  const module = modules.find(module => module.index === index);
  if (typeof module === "undefined") return Decimal(0);
  return Decimal(0.1).pow(module.rarity);
});
/** @type {Decimal} */
const chancesSum = chances.reduce((a, b) => a.add(b), Decimal(0));
/** @type {Decimal[]} */
export const moduleChances = chances.map(chance => chance.div(chancesSum));

/** @type {Record<ModuleTypes, UpgradeGenerator>} */
const moduleNameToModule = Object.fromEntries(
  Object.entries(moduleEnum).map(
    ([name, _]) => [name, modules.find(module => module.name === name) ?? null]
  )
);
/** @type {Record<number, UpgradeGenerator>} */
const moduleIndexToModule = Object.fromEntries(
  Object.entries(moduleEnum).map(
    ([_, idx]) => [idx, modules.find(module => module.index === idx)] ?? null
  )
);
/**
 * @param {string} name 
 * @returns {UpgradeGenerator}
 */
export function getModuleByName(name) {
  return moduleNameToModule[name];
}
/**
 * @param {number} idx 
 * @returns {UpgradeGenerator}
 */
export function getModuleByIndex(idx) {
  return moduleIndexToModule[idx];
}
/**
 * @param {number} idx 
 * @returns {ModuleTypes}
 */
export function getModuleNameByIndex(idx) {
  return getModuleByIndex(idx)?.name ?? null;
}

export default modules;
