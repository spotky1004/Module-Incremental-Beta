import Decimal from "../lib/decimal.min.js";
import roman from "../util/roman.js";

export const UPGRADE_LEVEL_LIMIT = 50;

/**
 * @callback UpgradeEffectFunc
 * @param {number} tier
 * @param {number} level
 * @param {import("./Player.js").SavedataValues} savedata
 * @return {Decimal}
 */
/**
 * @callback UpgradeCostFunc
 * @param {number} tier
 * @param {number} level
 * @param {import("./Player.js").SavedataValues} savedata
 */

/**
 * @typedef UpgradeChunk
 * @property {string} upgradeName
 * @property {number} level
 * @property {string} name
 * @property {UpgradeGenerator} color
 * @property {import("./UpgradeEffects.js").EffectChunk[]} effect
 * @property {Decimal} cost
 */

class UpgradeGenerator {
  /**
   * @typedef UpgradeParams
   * @property {string} name
   * @property {number} index
   * @property {string} color
   * @property {Object<string, UpgradeEffectFunc>} effects
   * @property {UpgradeCostFunc} cost
   * @property {number} rarity
   */
  /**
   * @param {UpgradeParams} options 
   */
  constructor(options) {
    /** @type {options["name"]} */
    this.name = options.name;
    /** @type {options["index"]} */
    this.index = options.index;
    /** @type {options["color"]} */
    this.color = options.color;
    /** @type {options["effects"]} */
    this.effects = options.effects;
    /** @type {options["cost"]} */
    this.cost = options.cost;
    /** @type {options["rarity"]} */
    this.rarity = options.rarity ?? Infinity;
  }

  /**
   * @param {number} tier 
   * @param {number[]} levelToOmit 
   * @param {import("./Player.js").SavedataValues} savedata
   * @param {number} count 
   */
  getUpgrades(tier, levelToOmit=[], savedata, count=10) {
    /** @type {UpgradeChunk[]} */
    const upgradeChunks = [];
    let level = -1;
    while (upgradeChunks.length < count) {
      level++;
      if (level >= UPGRADE_LEVEL_LIMIT) break;
      if (levelToOmit.includes(level)) continue;
      upgradeChunks.push({
        upgradeName: this.name,
        level,
        name: this.name + " " + roman(level+1),
        color: this.color,
        effect: this.getUpgradeEffect(tier, level, savedata),
        cost: Decimal(this.cost(tier, level, savedata))
      });
    }
    return upgradeChunks;
  }

  /**
   * @param {number} tier 
   * @param {number} level 
   * @param {import("./Player.js").SavedataValues} savedata
   */
  getUpgradeEffect(tier, level, savedata) {
    /** @type {import("./UpgradeEffects.js").EffectChunk[]} */
    const effects = [];
    for (const effectName in this.effects) {
      const effectFunc = this.effects[effectName];
      effects.push({
        name: effectName,
        value: Decimal(effectFunc(tier, level, savedata))
      });
    }
    return effects;
  }
}

export default UpgradeGenerator;
