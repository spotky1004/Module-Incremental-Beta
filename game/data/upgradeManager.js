import UpgradeManager from "../../class/UpgradeManager.js";
import upgradeEffects from "./upgradeEffects.js";
import modules from "./modules.js";

const upgradeManager = new UpgradeManager(upgradeEffects, modules);

export default upgradeManager;
