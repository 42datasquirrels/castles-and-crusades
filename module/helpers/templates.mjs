/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @returns {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/castles-and-crusades/templates/actor/parts/actor-combat.html",
    "systems/castles-and-crusades/templates/actor/parts/actor-description.html",
    "systems/castles-and-crusades/templates/actor/parts/actor-items.html",
    "systems/castles-and-crusades/templates/actor/parts/actor-spells.html",
    "systems/castles-and-crusades/templates/actor/parts/actor-features.html",
    "systems/castles-and-crusades/templates/actor/parts/monster-combat.html"
  ]);
};
