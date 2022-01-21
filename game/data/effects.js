import upgradeManager from "./upgradeManager.js";
import { savedata } from "./player.js";

const effects = upgradeManager.getUpgradeEffects(savedata);

function updateEffects() {
  const tmpEffects = upgradeManager.getUpgradeEffects(savedata);
  for (const effectName in tmpEffects) {
    effects[effectName] = tmpEffects[effectName];
  }
}

export default effects;
export { updateEffects };
