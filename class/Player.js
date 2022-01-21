import Decimal from "../lib/decimal.min.js";
import typeEqualize from "../util/typeEqualize.js";

/**
 * @typedef SavedataValues
 * @property {number} lastTickAt
 * @property {import("../game/data/elements.js").TabNames} watchingTab
 * @property {number} autobuyCharge
 * @property {number} time
 * @property {number} prestigeTime
 * @property {Decimal} gold
 * @property {string[]} selectedUpgrades
 * @property {number[][]} boughtUpgrades
 * @property {Decimal} prestige
 * @property {number} upgraders
 * @property {Record<import("../game/upgradeGenerators.js").UpgradeGeneratorType, { tier: number, exp: Decimal }>} modules
 */

/**
 * @type {SavedataValues}
 */
const savedataDefaults = {
  lastTickAt: new Date().getTime(),
  watchingTab: "modules",
  autobuyCharge: 0,
  time: 0,
  prestigeTime: 0,
  gold: Decimal(0),
  selectedUpgrades: [],
  boughtUpgrades: Array(20).fill().map(_ => []),
  prestige: new Decimal(0),
  upgraders: 0,
  modules: {
    "Gold Mine": {
      tier: 0,
      exp: new Decimal(0),
    },
    "Prestige Gain": {
      tier: 0,
      exp: new Decimal(0)
    }
  }
};


class Player {
  constructor() {
    /** @type {SavedataValues} */
    this.savedata = {};
    this.init();
  }

  clearSavedata() {
    for (const key in this.savedata) {
      delete this.savedata[key];
    }
  }

  init() {
    this.clearSavedata();
    this.savedata = typeEqualize(this.savedata, savedataDefaults);
  }

  save(key) {
    localStorage.setItem(key, window.btoa(JSON.stringify(this.savedata)));
  }

  load(key) {
    const data = localStorage.getItem(key);
    this.init();
    if (data === null) return;
    try {
      this.clearSavedata();
      /** @type {SavedataValues} */
      const savedata = JSON.parse(window.atob(data));
      for (const key in savedata) {
        this.savedata[key] = savedata[key];
      }
      const defaults = savedataDefaults;
      this.savedata = typeEqualize(this.savedata, defaults);
    } catch (e) {
      this.init();
    }
  }
}

export default Player;
