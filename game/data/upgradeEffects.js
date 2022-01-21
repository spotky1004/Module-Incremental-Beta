import UpgradeEffects from "../../class/UpgradeEffects.js";
import Decimal from "../../lib/decimal.min.js";

const upgradeEffects = new UpgradeEffects({
  goldGain: {
    defaultValue: 1,
    effectReducerFunc: (a, b) => a.add(b),
    effectFinalizeFunc: (value) => value,
    display: {
      name: "Gold Gain",
      color: "#f0e52b",
      operator: "+"
    }
  },
  goldGainMult: {
    defaultValue: 1,
    effectReducerFunc: (a, b) => a.mul(b),
    effectFinalizeFunc: (value) => value,
    display: {
      name: "Gold Mult",
      color: "#ebe7a4",
      operator: "×"
    }
  },
  prestigeGain: {
    defaultValue: 0,
    effectReducerFunc: (a, b) => a.add(b),
    effectFinalizeFunc: (value) => value,
    display: {
      name: "Prestige Gain",
      color: "#345eeb",
      operator: "+"
    }
  },
  autobuy: {
    defaultValue: 0,
    effectReducerFunc: (a, b) => a.add(b),
    effectFinalizeFunc: (value) => value,
    display: {
      name: "Autobuy",
      color: "#12e686",
      operator: "+"
    }
  },
  maxModule: {
    defaultValue: 2,
    effectReducerFunc: (a, b) => a.add(b),
    effectFinalizeFunc: (value) => Decimal.min(20, value).floor(),
    display: {
      name: "Max Module",
      color: "#ffffff",
      operator: "+"
    }
  }
});

export default upgradeEffects;
export const effectNameEnum = upgradeEffects.getEffectNameEnum();
