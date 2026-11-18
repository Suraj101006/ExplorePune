const fs = require('fs');
const path = require('path');

function getApiRoutes(dir, baseRoute = '/api') {
  let routes = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      routes = routes.concat(getApiRoutes(fullPath, `${baseRoute}/${entry.name}`));
    } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
      routes.push({
        endpoint: baseRoute,
        file: fullPath
      });
    }
  }
  return routes;
}

const apiDir = path.join(process.cwd(), 'app', 'api');
const routes = getApiRoutes(apiDir);
console.log('=== DISCOVERED API ROUTES (' + routes.length + ') ===');
routes.forEach(r => {
  const content = fs.readFileSync(r.file, 'utf8');
  const methods = [];
  if (content.includes('export async function GET') || content.includes('export function GET')) methods.push('GET');
  if (content.includes('export async function POST') || content.includes('export function POST')) methods.push('POST');
  if (content.includes('export async function PUT') || content.includes('export function PUT')) methods.push('PUT');
  if (content.includes('export async function DELETE') || content.includes('export function DELETE')) methods.push('DELETE');
  if (content.includes('export async function PATCH') || content.includes('export function PATCH')) methods.push('PATCH');
  console.log(`${r.endpoint} -> [${methods.join(', ')}]`);
});
