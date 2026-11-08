const fs = require('fs');
const path = require('path');
const food = require('./templates_data/food.js');
const parks = require('./templates_data/parks.js');
const museums = require('./templates_data/museums.js');
const forts = require('./templates_data/forts.js');
const nature = require('./templates_data/nature.js');
const temples = require('./templates_data/temples.js');
const heritage = require('./templates_data/heritage.js');

const allModules = { ...food, ...parks, ...museums, ...forts, ...nature, ...temples, ...heritage };
const slugsCovered = Object.keys(allModules);
console.log('Total templates crafted:', slugsCovered.length);

const published = JSON.parse(fs.readFileSync('./data/published_106_places.json', 'utf8'));
const publishedSlugs = published.map(p => p.slug || p.id);

const missing = publishedSlugs.filter(s => !allModules[s]);
console.log('Missing from templates:', missing);

const titles = new Set();
const duplicateTitles = [];
for (const [slug, t] of Object.entries(allModules)) {
  if (titles.has(t.templateTitle)) {
    duplicateTitles.push({ slug, title: t.templateTitle });
  }
  titles.add(t.templateTitle);
}
console.log('Duplicate titles count:', duplicateTitles.length);

let actsCountErrors = 0;
for (const [slug, t] of Object.entries(allModules)) {
  if (!t.acts || t.acts.length !== 5) {
    actsCountErrors++;
    console.error('Invalid acts count for:', slug, t.acts ? t.acts.length : 0);
  }
}
console.log('Acts count errors:', actsCountErrors);
