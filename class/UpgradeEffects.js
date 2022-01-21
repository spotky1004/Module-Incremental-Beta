import Decimal from "../lib/decimal.min.js";

/**
 * @callback EffectReducerFunc
 * @param {Decimal} a
 * @param {number | string | Decimal} b
 * @returns {number | Decimal}
 */
/**
 * @callback EffectFinalizeFunc
 * @param {Decimal} value
 * @returns {number | Decimal}
 */
/**
 * @typedef EffectDisplay
 * @property {string} name
 * @property {string} operator
 * @property {string} color
 */
/**
 * @typedef EffectData
 * @property {number | string} defaultValue
 * @property {EffectReducerFunc} effectReducerFunc
 * @property {EffectFinalizeFunc} effectFinalizeFunc
 * @property {EffectDisplay} display
 */

/**
 * @typedef EffectChunk
 * @property {string} name
 * @property {color} string
 * @property {number | Decimal} value
 */

/**
 * @template {Object<string, EffectData>} T
 */
class UpgradeEffects {
  /**
   * @param {T} effectDatas 
   */
  constructor(effectDatas) {
    /** @type {T} */
    this.effectsDatas = {...effectDatas};
  }

  /**
   * @returns {Record<keyof T, keyof T>}
   */
  getEffectNameEnum() {
    return Object.fromEntries(Object.keys(this.effectsDatas).map(effectName => [effectName, effectName]));
  }

  /**
   * @param {EffectChunk[]} effectChunks 
   * @returns {Record<keyof T, Decimal>}
   */
  calculateEffect(effectChunks) {
    /** @type {Record<keyof T, Decimal>} */
    const effects = {};
    for (const effectName in this.effectsDatas) {
      const effectData = this.effectsDatas[effectName];
      effects[effectName] = Decimal(effectData.defaultValue);
    }
    
    for (let i = 0; i < effectChunks.length; i++) {
      const effectChunk = effectChunks[i];
      const effectName = effectChunk.name;
      const effectData = this.effectsDatas[effectName];
      effects[effectName] = effectData.effectReducerFunc(
        effects[effectName],
        effectChunk.value
      );
    }

    for (const effectName in this.effectsDatas) {
      const effectData = this.effectsDatas[effectName];
      effects[effectName] = effectData.effectFinalizeFunc(effects[effectName]);
    }

    return effects;
  }
}

export default UpgradeEffects;
