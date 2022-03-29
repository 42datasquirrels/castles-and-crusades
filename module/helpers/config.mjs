export const TLGCC = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */
 TLGCC.abilities = {
  "str": "TLGCC.AbilityStr",
  "dex": "TLGCC.AbilityDex",
  "con": "TLGCC.AbilityCon",
  "int": "TLGCC.AbilityInt",
  "wis": "TLGCC.AbilityWis",
  "cha": "TLGCC.AbilityCha"
};

TLGCC.abilityAbbreviations = {
  "str": "TLGCC.AbilityStrAbbr",
  "dex": "TLGCC.AbilityDexAbbr",
  "con": "TLGCC.AbilityConAbbr",
  "int": "TLGCC.AbilityIntAbbr",
  "wis": "TLGCC.AbilityWisAbbr",
  "cha": "TLGCC.AbilityChaAbbr"
};

/**
 * The set of Saving Throws used within the sytem.
 * @type {Object}
 */
TLGCC.saves = {
  "death": "TLGCC.SaveDeath",
  "wands": "TLGCC.SaveWands",
  "paralysis": "TLGCC.SaveParalysis",
  "breath": "TLGCC.SaveBreath",
  "spells": "TLGCC.SaveSpells"
};

/**
 * Money used within the sytem.
 * @type {Object}
 */
TLGCC.money = {
  "pp": "TLGCC.Platinum",
  "gp": "TLGCC.Gold",
  "ep": "TLGCC.Electrum",
  "sp": "TLGCC.Silver",
  "cp": "TLGCC.Copper"
};
