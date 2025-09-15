import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.resolve("public/_posts");
const MANIFEST = path.join(POSTS_DIR, "index.json");

// 읽기 시간 (한글 대략 600자/분)
function estimateReadTimeKorean(markdown, cpm = 600) {
  let text = markdown.replace(/```[\s\S]*?```/g, "").replace(/`[^`]+`/g, "");
  text = text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*|__|\*|_|~~/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/>\s?/g, "");
  const charCount = text.replace(/\s+/g, "").length;
  return `${Math.max(1, Math.ceil(charCount / cpm))}분`;
}

function toPublicPath(absFile) {
  // public 하위 경로를 URL 경로로 변환
  const rel = path.relative(path.resolve("public"), absFile).replaceAll("\\", "/");
  return `/${rel}`;
}

function normalizeId(fileName) {
  return fileName.replace(/\.md$/i, "");
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function main() {
  ensureDir(POSTS_DIR);

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".md"));

  const items = [];

  for (const file of files) {
    const abs = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(abs, "utf-8");
    const { data, content } = matter(raw);

    // 최소 필드 체크
    if (!data.title || !data.date || !data.category) {
      console.warn(`[warn] front-matter 누락: ${file} (title/date/category 필요)`);
      continue;
    }

    const entry = {
      id: data.id?.toString() ?? normalizeId(file),
      title: data.title,
      excerpt: data.excerpt ?? "",
      category: data.category,
      date: new Date(data.date).toISOString(),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      readTime: data.readTime ?? estimateReadTimeKorean(content, 600),
      file: toPublicPath(abs), // 예: /_posts/2025-03-29-sites.md
    };

    items.push(entry);
  }

  // 최신순 정렬
  items.sort((a, b) => +new Date(b.date) - +new Date(a.date));

  fs.writeFileSync(MANIFEST, JSON.stringify(items, null, 2), "utf-8");
  console.log(`[ok] generated ${MANIFEST} (${items.length} posts)`);
}

main();
