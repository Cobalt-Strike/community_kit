const fs = require('fs');
const path = require('path');
const axios = require('axios');

const GITHUB_RAW = 'https://raw.githubusercontent.com';

async function fetchGitHubSnippet(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/([^#]+)#L(\d+)-L(\d+)/);
  if (!match) return null;

  const [ , owner, repo, branch, filePath, start, end ] = match;
  const rawUrl = `${GITHUB_RAW}/${owner}/${repo}/${branch}/${filePath}`;
  const res = await axios.get(rawUrl);
  const lines = res.data.split('\n').slice(+start - 1, +end);
  return lines.join('\n');
}

function findMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory()
      ? findMarkdownFiles(fullPath)
      : entry.name.endsWith('.md') ? [fullPath] : [];
  });
}

async function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const regex = /```embed\n(.*?)\n```/gs;

  let changed = false;

  content = await content.replace(regex, async (_, url) => {
    const snippet = await fetchGitHubSnippet(url.trim());
    if (snippet) {
      changed = true;
      return `\`\`\`\n${snippet}\n\`\`\``;
    }
    return _;
  });

  if (changed) fs.writeFileSync(filePath, content, 'utf8');
}

async function main() {
  const files = findMarkdownFiles('.');
  for (const file of files) {
    await processFile(file);
  }
}

main().catch(console.error);
