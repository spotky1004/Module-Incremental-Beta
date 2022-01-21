import Player from "../../class/Player.js";
import { moduleEnum } from "./modules.js";
import Decimal from "../../lib/decimal.min.js";

const saveKey = "Module Incremental test";
const player = new Player();
const savedata = player.savedata;
player.load(saveKey);

// savedaats fix
for (const upgradeName in moduleEnum) {
  if (typeof savedata.modules[upgradeName] !== "undefined") continue;
  savedata.modules[upgradeName] = {
    tier: -1,
    exp: new Decimal(0)
  };
}
player.save(saveKey);

export default player;
export { savedata, saveKey };
