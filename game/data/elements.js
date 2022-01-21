import upgradeEffects from "./upgradeEffects.js";
import { getModuleByIndex } from "./modules.js";
import roman from "../../util/roman.js";
import notation from "../../util/notation.js";

/**
 * @typedef {["modules", "prestige", "options"][number]} TabNames
 */
/**
 * @typedef Effect
 * @property {HTMLDivElement} element
 * @property {HTMLSpanElement} name
 * @property {HTMLSpanElement} value
 */
/**
 * @typedef Upgrade
 * @property {HTMLSpanElement} element
 * @property {HTMLDivElement} name
 * @property {HTMLDivElement} effectList
 * @property {Effect[]} effects
 * @property {HTMLDivElement} cost
 */
const elements = {
  /** @typedef {["gold", "prestige"][number]} ResourceNames */
  /** @type {Record<ResourceNames, HTMLSpanElement>} */
  resources: {
    gold: document.getElementById("resources__gold"),
    prestige: document.getElementById("resources__prestige")
  },
  /** @type {HTMLSpanElement[]} */
  upgradeModules: [],
  /** @type {Upgrade[]} */
  upgrades: [],
  /** @type {Effect[]} */
  effects: [],
  /** @type {Record<TabNames, HTMLSpanElement>} */
  tabButtons: {
    modules: document.querySelector("#tab-buttons > .tab-button[data-tab-name=\"modules\"]"),
    prestige: document.querySelector("#tab-buttons > .tab-button[data-tab-name=\"prestige\"]"),
    options: document.querySelector("#tab-buttons > .tab-button[data-tab-name=\"options\"]"),
  },
  /** @type {Record<TabNames, HTMLDivElement>} */
  tabs: {
    modules: document.querySelector("#tabs > div[data-tab-name=modules]"),
    prestige: document.querySelector("#tabs > div[data-tab-name=prestige]"),
    options: document.querySelector("#tabs > div[data-tab-name=options]"),
  },
  prestige: {
    /** @type {HTMLDivElement} */
    button: document.getElementById("prestige-button"),
    info: {
      /** @type {HTMLSpanElement} */
      prevPrestige: document.getElementById("prestige-prev__value-prestige"),
      /** @type {HTMLSpanElement} */
      nextPrestige: document.getElementById("prestige-next__value-prestige"),
      /** @type {HTMLSpanElement} */
      nextModule: document.getElementById("prestige-next__value-module"),
    }
  },
  modules: {
    /** @type {{ element: HTMLSpanElement, tier: HTMLDivElement, check: SVGGraphicsElement, exp: HTMLDivElement }[]} */
    grid: [],
    upgrader: {
      /** @type {HTMLDivElement} */
      value: document.getElementById("upgrader__display__value"),
      button: {
        /** @type {HTMLSpanElement} */
        buy: document.getElementById("upgrader__buy-button"),
        /** @type {HTMLSpanElement} */
        respec: document.getElementById("upgrader__respec-button"),
      }
    },
    /** @typedef {{ prev: HTMLSpanElement, value: HTMLSpanElement, next: HTMLSpanElement }} SelectedModuleEffectLevel */
    /**
     * @typedef SelectedModule
     * @property {HTMLSpanElement} element
     * @property {HTMLDivElement} name
     * @property {{ level: SelectedModuleEffectLevel, list: Effect[], cost: HTMLDivElement }} effect
     * @property {{ tier: HTMLDivElement, exp: HTMLDivElement, expText: HTMLDivElement }} data
     * @property {{ equip: HTMLSpanElement, upgrade: HTMLSpanElement }} button
     */
    /** @type {SelectedModule} */
    selected: {
      element: document.getElementById("selected-module"),
      name: document.getElementById("selected-module__name"),
      effect: {
        level: {
          prev: document.getElementById("selected-module__effects__level__prev-button"),
          value: document.getElementById("selected-module__effects__level__value"),
          next: document.getElementById("selected-module__effects__level__next-button"),
        },
        list: [],
        cost: document.getElementById("selected-module__effect__cost"),
      },
      data: {
        tier: document.getElementById("selected-module__data__tier"),
        exp: document.getElementById("selected-module__data__exp"),
        expText: document.getElementById("selected-module__data__exp__value")
      },
      button: {
        equip: document.getElementById("selected-module__buttons__equip"),
        upgrade: document.getElementById("selected-module__buttons__upgrade"),
      }
    },
  }
};

const upgradeModules = document.getElementById("upgrade-modules");
for (let i = 0; i < 20; i++) {
  const upgradeModule = document.createElement("span");
  elements.upgradeModules.push(upgradeModule);
  upgradeModules.append(upgradeModule);

  upgradeModule.innerHTML = "Module#"+(i+1);
  upgradeModule.classList.add("upgrade-modules__item");
}

const upgradeList = document.getElementById("upgrade-list");
for (let i = 0; i < 10; i++) {
  /** @type {Upgrade} */
  const upgrade = {};
  elements.upgrades.push(upgrade);

  // upgrade
  upgrade.element = document.createElement("span");
  upgrade.element.classList.add("upgrade");
  upgradeList.appendChild(upgrade.element);

  // upgrade__name
  upgrade.name = document.createElement("div");
  upgrade.name.innerHTML = "Upgrade " + roman(i+1);
  upgrade.name.classList.add("upgrade__name");
  upgrade.element.appendChild(upgrade.name);

  // upgrade__effect-list
  upgrade.effectList = document.createElement("div");
  upgrade.effectList.classList.add("upgrade__effect-list");
  upgrade.element.appendChild(upgrade.effectList);

  // upgrade__effect-list__item
  upgrade.effects = [];
  for (let j = 0; j < 5; j++) {
    /** @type {Upgrade["effects"][number]} */
    const upgradeEffect = {};
    upgrade.effects.push(upgradeEffect);

    upgradeEffect.element = document.createElement("div");
    upgradeEffect.element.classList.add("upgrade__effect-list__item");
    upgrade.effectList.appendChild(upgradeEffect.element);

    upgradeEffect.name = document.createElement("span");
    upgradeEffect.name.innerHTML = "Boost " + roman(j+1);
    upgradeEffect.name.classList.add("upgrade__effect-list__item__name");
    upgradeEffect.element.appendChild(upgradeEffect.name);

    upgradeEffect.value = document.createElement("span");
    upgradeEffect.value.innerHTML = notation(10**(Math.random()*5+i*5));
    upgradeEffect.value.classList.add("upgrade__effect-list__item__value");
    upgradeEffect.element.appendChild(upgradeEffect.value);
  }

  // upgrade__cost
  upgrade.cost = document.createElement("div");
  upgrade.cost.innerHTML = notation(10**(Math.random()*10+i*10));
  upgrade.cost.classList.add("upgrade__cost");
  upgrade.element.appendChild(upgrade.cost);
}

const effectList = document.getElementById("effect-list");
for (const effectName in upgradeEffects.effectsDatas) {
  /** @type {Effect} */
  const effect = {};
  elements.effects.push(effect);

  /** @type {import("../class/UpgradeEffects.js").EffectData} */
  const effectData = upgradeEffects.effectsDatas[effectName];
  
  effect.element = document.createElement("div");
  effect.element.classList.add("effect-list__item");
  effectList.append(effect.element);
  
  effect.name = document.createElement("span");
  effect.name.classList.add("effect-list__item__name");
  effect.name.innerHTML = effectData.display.name;
  effect.name.style.color = effectData.display.color;
  effect.element.append(effect.name);

  effect.value = document.createElement("span");
  effect.value.classList.add("effect-list__item__value");
  effect.value.innerHTML = effectData.display.operator + " " + notation(effectData.defaultValue);
  effect.element.append(effect.value);
}

const moduleGrid = document.getElementById("module-grid");
for (let i = 0; i < 36; i++) {
  /** @type {elements["modules"]["grid"][number]} */
  const gridItem = {};
  elements.modules.grid.push(gridItem);

  const module = getModuleByIndex(i);

  gridItem.element = document.createElement("span");
  gridItem.element.classList.add("module-grid__item");
  gridItem.element.dataset.name = module?.name ?? "hi!";
  gridItem.element.dataset.index = i;
  gridItem.element.classList.add("locked");
  gridItem.element.classList.add("equip");
  const color = module?.color ?? "";
  if (color === "") gridItem.element.style.opacity = 0;
  gridItem.element.style.setProperty("--color", color);
  gridItem.element.style.setProperty("--rotate", (Math.random()*20-10)+"deg");
  moduleGrid.appendChild(gridItem.element);
  
  gridItem.tier = document.createElement("div");
  gridItem.tier.classList.add("module-grid__item__tier");
  gridItem.tier.innerText = 0;
  gridItem.element.appendChild(gridItem.tier);
  
  gridItem.check = document.createElement("i");
  gridItem.check.classList.add("module-grid__item__check", "fas", "fa-check");
  gridItem.element.appendChild(gridItem.check);

  gridItem.exp = document.createElement("div");
  gridItem.exp.classList.add("module-grid__item__exp");
  gridItem.exp.innerText = "0%";
  gridItem.element.appendChild(gridItem.exp);
}

const selectedModuleEffectList = document.getElementById("selected-module__effect__list");
for (let i = 0; i < 5; i++) {
  /** @type {Effect} */
  const effect = {};
  elements.modules.selected.effect.list.push(effect);

  effect.element = document.createElement("div");
  effect.element.classList.add("selected-module__effect__list__item");
  selectedModuleEffectList.appendChild(effect.element);

  effect.name = document.createElement("span");
  effect.name.classList.add("selected-module__effect__list__item__name");
  effect.name.innerText = "EffectName";
  effect.element.appendChild(effect.name);

  effect.value = document.createElement("span");
  effect.value.classList.add("selected-module__effect__list__item__value");
  effect.value.innerText = "+ 0";
  effect.element.appendChild(effect.value);
}

export default elements;
