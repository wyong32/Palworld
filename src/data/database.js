export const databaseCategoryOrder = [
  "Weapons",
  "Ammo",
  "Armor",
  "Consumables",
  "Accessories",
  "Pal Gear",
  "Spheres",
  "Bosses",
  "Predators",
  "Enemies",
  "Ingredients",
  "Materials",
  "Schematics",
  "Structures",
  "Furniture",
  "Utility",
  "Items",
];

export function databaseCategorySlug(category) {
  return category
    .toLowerCase()
    .replace("&", " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "items";
}

export function getDatabaseCategoryGroups(items) {
  const orderedGroups = databaseCategoryOrder
    .map((category) => ({
      category,
      slug: databaseCategorySlug(category),
      items: items.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);

  const fallbackGroups = items
    .filter((item) => !databaseCategoryOrder.includes(item.category))
    .reduce((acc, item) => {
      acc[item.category] ||= [];
      acc[item.category].push(item);
      return acc;
    }, {});

  return [
    ...orderedGroups,
    ...Object.entries(fallbackGroups)
      .map(([category, groupItems]) => ({
        category,
        slug: databaseCategorySlug(category),
        items: groupItems,
      }))
      .sort((a, b) => a.category.localeCompare(b.category)),
  ];
}

export function getDatabaseCategoryBySlug(items, categorySlug) {
  return getDatabaseCategoryGroups(items).find((group) => group.slug === categorySlug);
}

export function getDatabaseItemPath(item) {
  return `/database/${databaseCategorySlug(item.category)}/${item.addressBar}`;
}
