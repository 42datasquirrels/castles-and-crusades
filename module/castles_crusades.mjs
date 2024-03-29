// Import document classes.
import { tlgccActor } from "./documents/actor.mjs";
import { tlgccItem } from "./documents/item.mjs";
// Import sheet classes.
import { tlgccActorSheet } from "./sheets/actor-sheet.mjs";
import { tlgccItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { TLGCC } from "./helpers/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once("init", async function() {
  console.log(`TLGCC | Initializing the Castles & Crusades Game System\n${TLGCC.ASCII}`);

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.tlgcc = {
    tlgccActor,
    tlgccItem,
    rollItemMacro
  };

  // Add custom constants for configuration.
  CONFIG.TLGCC = TLGCC;

  /**
   * Set an initiative formula for the system
   * @type {string}
   */
  CONFIG.Combat.initiative = {
    formula: "max(1, 1d10)",
    decimals: 0
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = tlgccActor;
  CONFIG.Item.documentClass = tlgccItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("tlgcc", tlgccActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("tlgcc", tlgccItemSheet, { makeDefault: true });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper("concat", function() {
  let outStr = "";
  for (let arg in arguments) {
    if (typeof arguments[arg] != "object") {
      outStr += arguments[arg];
    }
  }
  return outStr.trim();
});


Handlebars.registerHelper("toLowerCase", function(str) {
  return str.toLowerCase();
});

Handlebars.registerHelper("localizeLowerCase", function(str) {
  return game.i18n.localize(str).toLowerCase();
});

Handlebars.registerHelper("toUpperCase", function(str) {
  return str.toUpperCase();
});

Handlebars.registerHelper("localizeUpperCase", function(str) {
  return game.i18n.localize(str).toUpperCase();
});

Handlebars.registerHelper("toCapitalCase", function(str) {
  return str.replace(/\w\S*/g, w => (w.replace(/^\w/, c => c.toUpperCase())));
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Character Creation Hooks                    */
/* -------------------------------------------- */

Hooks.on("createActor", async function(actor) {
  if (actor.type === "character") {
    actor.data.token.actorLink = true;
  }
});

/* -------------------------------------------- */
/*  Token Creation Hooks                        */
/* -------------------------------------------- */

Hooks.on("createToken", async function(token, options, id) {
  if (token.actor.type === "monster") {
    let newHitPoints = new Roll(`${token.actor.data.data.hitDice.number}${token.actor.data.data.hitDice.size}+${token.actor.data.data.hitDice.mod}`);
    await newHitPoints.evaluate({ async: true });
    token.actor.data.data.hitPoints.value = Math.max(1, newHitPoints.total);
    token.actor.data.data.hitPoints.max = Math.max(1, newHitPoints.total);
  }
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
  const item = data.data;

  // Create the macro command
  const command = `game.tlgcc.rollItemMacro("${item.name}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "tlgcc.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @returns {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  // Trigger the item roll
  return item.roll();
}
