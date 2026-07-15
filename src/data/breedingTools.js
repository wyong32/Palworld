export const breedingSteps = [
  {
    title: "Unlock and place the Breeding Farm",
    action:
      "Reach Technology level 19, spend 2 Technology Points, then place the farm where workers can path to the chest and feed box.",
    detail:
      "The structure costs 100 Wood, 20 Stone, and 50 Fiber. Leave space around the entrance because assigned parents can reset if pathing breaks.",
  },
  {
    title: "Assign one male and one female Pal",
    action:
      "Pick up each parent and throw it at the Breeding Farm assignment point until the farm panel confirms both parents are assigned.",
    detail:
      "Use parents with the passive skills you want to inherit. If a parent walks away, rebuild pathing or move the farm closer to beds and food.",
  },
  {
    title: "Keep Cake in the farm chest",
    action:
      "Put Cake directly in the Breeding Farm chest. One Cake is consumed per egg, and Cake stored there does not spoil.",
    detail:
      "A steady Cake line is the main bottleneck, so automate Wheat, Berries, Milk, Eggs, Honey, transport, watering, kindling, and cooling before mass breeding.",
  },
  {
    title: "Incubate and judge the result",
    action:
      "Move the egg to an Egg Incubator, hatch it, then keep or retire the child based on passives, element, work suitability, and combat role.",
    detail:
      "For chain breeding, use the successful child as the next parent and repeat until the target passive set is stable.",
  },
];

export const cakeProductionPlan = [
  {
    item: "Flour",
    quantity: "5",
    source: "Grow Wheat, process it in a Mill, and keep a Watering Pal assigned.",
    tip: "Two Wheat Plantations are enough for early breeding; add more when cooking cannot keep up.",
  },
  {
    item: "Red Berries",
    quantity: "8",
    source: "Run Berry Plantations near the kitchen and let Gathering and Transporting workers clear the harvest.",
    tip: "Berries are also food, so separate breeding stock from base meal supply if Cake stalls.",
  },
  {
    item: "Milk",
    quantity: "7",
    source: "Assign Mozzarina to a Ranch and keep transport routes short.",
    tip: "Milk shortages usually mean ranch drops are sitting on the ground, not that you need more Mozzarina.",
  },
  {
    item: "Egg",
    quantity: "8",
    source: "Assign Chikipi to a Ranch.",
    tip: "Egg supply scales well because Chikipi is easy to catch near starter routes.",
  },
  {
    item: "Honey",
    quantity: "2",
    source: "Assign Beegarde to a Ranch or stockpile Honey from combat drops.",
    tip: "Honey is the late-early-game gate for reliable mass breeding.",
  },
  {
    item: "Cake",
    quantity: "1",
    source: "Cook at a Cooking Pot or better station, then store it inside the Breeding Farm chest.",
    tip: "Use a strong Kindling worker and a Cooler Box nearby for non-farm food storage.",
  },
];

export const featuredBreedingCombos = [
  {
    parentA: "Blazamut",
    parentB: "Dualith",
    target: "Anubis",
    role: "1.0 standard result",
    why: "A current 1.0 route for producing Anubis after the breeding table overhaul.",
    action: "Use this route for a fresh Anubis line; pre-1.0 Penking and Bushi notes no longer produce Anubis.",
  },
  {
    parentA: "Relaxaurus",
    parentB: "Sparkit",
    target: "Relaxaurus Lux",
    role: "Fixed variant pair",
    why: "This fixed pair produces the Electric variant rather than a normal breeding-power result.",
    action: "Use Sparkit to convert Relaxaurus into its electric variant, then judge the child for mount/combat passives.",
  },
  {
    parentA: "Grizzbolt",
    parentB: "Grizzbolt",
    target: "Grizzbolt",
    role: "Same-species line",
    why: "Palworld 1.0 limits Grizzbolt breeding to the same species.",
    action: "Capture the first breeding pair, then use same-species eggs to combine better combat or base passives.",
  },
  {
    parentA: "Orserk",
    parentB: "Orserk",
    target: "Orserk",
    role: "Same-species line",
    why: "The 1.0 breeding table requires two Orserk parents for another Orserk.",
    action: "Secure two Orserk first, then consolidate Electric combat and base-generation passives through repeated eggs.",
  },
  {
    parentA: "Shadowbeak",
    parentB: "Shadowbeak",
    target: "Shadowbeak",
    role: "Same-species line",
    why: "Shadowbeak now continues through a same-species line instead of the former Kitsun and Astegon pairing.",
    action: "Capture a male and female Shadowbeak, then preserve only the strongest combat-focused children.",
  },
  {
    parentA: "Frostallion",
    parentB: "Helzephyr",
    target: "Frostallion Noct",
    role: "Fixed variant pair",
    why: "This fixed combination produces the Dark Frostallion variant in the current breeding table.",
    action: "Treat this as a late-game refinement project because both parents require serious capture preparation.",
  },
  {
    parentA: "Blazehowl",
    parentB: "Jormuntide",
    target: "Jormuntide Ignis",
    role: "Fixed variant pair",
    why: "This pair remains the direct route into Jormuntide Ignis after the 1.0 overhaul.",
    action: "Build a Kindling-focused line for base work or keep a separate combat line with offensive passives.",
  },
  {
    parentA: "Suzaku",
    parentB: "Jormuntide",
    target: "Suzaku Aqua",
    role: "Fixed variant pair",
    why: "This fixed pair converts Suzaku into its Water variant.",
    action: "Use this when your water lineup needs a strong flying Pal with improved passive inheritance.",
  },
];

export const mutationCards = [
  {
    title: "Mutation planning",
    playerAction:
      "After the 1.0 update, keep a separate breeding line for mutation attempts instead of risking your clean passive parent pair.",
    note: "Track Cake type, parent pair, child species, IV band, Alpha state, condensation stars, and rainbow passive results before moving a child into the main line.",
  },
  {
    title: "Cake variant testing",
    playerAction:
      "Track which egg came from normal Cake, Mushroom Cake, Vegetable Cake, Deluxe Vegetable Cake, or Special Cake.",
    note: "Use normal Cake as the baseline, Deluxe Vegetable Cake for Mutation batches, and Special Cake when passive transfer matters most.",
  },
  {
    title: "Patch-aware parent checks",
    playerAction:
      "Re-check old breeding routes after major patches, especially when Pal habitats, spawn levels, or rarity values are rebalanced.",
    note: "Palworld 1.0 changed habitats and added many Pals, so older route assumptions can drift.",
  },
];
