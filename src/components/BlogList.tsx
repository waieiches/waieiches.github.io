import { useEffect, useMemo, useState } from "react";
import { Input } from "./ui/input";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import ProfileImage from "../assets/profileImage.png";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import type { BlogPostType } from "../types/blog";

interface BlogListProps {
  onPostSelect: (post: BlogPostType) => void;
  onViewChange?: (view: "blog" | "about") => void;
}

const stripFrontMatter = (md: string) => {
  // ---로 시작하는 frontmatter 블럭 제거
  // --- ... --- 다음 줄까지 깔끔하게 날림
  return md.replace(/^---[\s\S]*?\n---\s*\r?\n?/, "");
};

type PostMeta = Omit<BlogPostType, "content"> & {
  file: string; // /_posts/xxx.md (public 경로)
};

const ALL = "전체보기";

export function BlogList({ onPostSelect, onViewChange }: BlogListProps) {
  const [metas, setMetas] = useState([] as PostMeta[]);
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(["Study"]);

  // 읽기 시간(한글 대략 600자/분)
  const estimateReadTimeKorean = (markdown: string, cpm = 600) => {
    let text = markdown.replace(/```[\s\S]*?```/g, "").replace(/`[^`]+`/g, "");
    text = text
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*|__|\*|_|~~/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/>\s?/g, "");
    const charCount = text.replace(/\s+/g, "").length;
    return `${Math.max(1, Math.ceil(charCount / cpm))}분`;
  };

  useEffect(() => {
    // 목록(manifest) 불러오기
    fetch("/_posts/index.json")
      .then((r) => r.json())
      .then((items: PostMeta[]) => {
        // 최신순
        items.sort((a, b) => +new Date(b.date) - +new Date(a.date));
        setMetas(items);
      })
      .catch((e) => console.error("posts manifest load error:", e));
  }, []);

  const getCategoryCount = (name: string) =>
    name === ALL
      ? metas.length
      : metas.filter((p) => p.category === name).length;

  // (기존 구조 유지) 카테고리 표시 데이터
  const categoryData = {
    [ALL]: { count: getCategoryCount(ALL), subcategories: [] as any[] },
    Study: {
      count: getCategoryCount("Study"),
      subcategories: [
        { name: "AI", count: 0 },
        { name: "Data", count: 0 },
        { name: "Cloud", count: 0 },
      ],
    },
    Project: { count: getCategoryCount("Project"), subcategories: [] },
    CS: { count: getCategoryCount("CS"), subcategories: [] },
    Algorithm: { count: getCategoryCount("Algorithm"), subcategories: [] },
  };

  const toggleCategory = (c: string) =>
    setExpandedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return metas.filter((post) => {
      const matchesCategory =
        selectedCategory === ALL || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        (post.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [metas, selectedCategory, searchQuery]);

  const handleSelect = async (meta: PostMeta) => {
    try {
      const mdRaw = await fetch(meta.file).then((r) => r.text());
      const md = stripFrontMatter(mdRaw); // ✅ 프론트매터 제거
      const post: BlogPostType = {
        ...meta,
        content: md, // ✅ 깨끗한 본문
        readTime: meta.readTime || estimateReadTimeKorean(md, 600),
      };
      onPostSelect(post);
    } catch (e) {
      console.error("post load error:", e);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-0">
              {/* Profile */}
              <div className="bg-white">
                <div className="text-center p-4">
                  <ImageWithFallback
                    src={ProfileImage}
                    alt="Profile"
                    className="w-30 h-30 rounded-full mx-auto mb-6 object-cover"
                  />
                  <h1 className="mb-4 google-sans-code-title-semi">
                    Hyeonseo Yu
                  </h1>
                  <div className="text-sm google-sans-code-text text-gray-500 mb-1">
                    LLM, Agent
                  </div>
                  <div
                    className="text-sm google-sans-code-title text-orange-500 cursor-pointer"
                    onClick={() => onViewChange && onViewChange("about")}
                  >
                    About me
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white border-t">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text">카테고리</h3>
                  </div>

                  <div className="space-y-0">
                    {Object.entries(categoryData).map(([category, data]) => (
                      <div key={category}>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <button
                            onClick={() => setSelectedCategory(category)}
                            className={`flex items-center text-sm ${
                              selectedCategory === category
                                ? "text-blue-600"
                                : "text-gray-700"
                            }`}
                          >
                            {category} ({data.count})
                            {category === "전체보기" && (
                              <span className="ml-1 bg-gray-200 text-xs px-1 rounded"></span>
                            )}
                          </button>
                          {data.subcategories.length > 0 && (
                            <button onClick={() => toggleCategory(category)}>
                              {expandedCategories.includes(category) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>

                        {expandedCategories.includes(category) &&
                          data.subcategories.map((sub: any) => (
                            <button
                              key={sub.name}
                              className={`flex items-center py-2 pl-6 text-sm w-full text-left ${
                                selectedCategory === sub.name
                                  ? "text-blue-600"
                                  : "text-gray-600"
                              }`}
                              onClick={() => setSelectedCategory(sub.name)}
                            >
                              <span className="ml-1">
                                {sub.name} ({sub.count})
                              </span>
                            </button>
                          ))}
                      </div>
                    ))}
                  </div>

                  {/* Blog Info Section */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="space-y-2 text-sm text-gray-500">
                      <div>총 {metas.length}개의 글</div>
                      <div>
                        최근 업데이트: {new Date().toLocaleDateString("ko-KR")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="블로그 글 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200"
                />
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="border-b border-gray-100 pb-6 last:border-b-0"
                >
                  <div className="text-sm text-gray-500 mb-2">
                    {post.category}
                  </div>

                  <h2
                    className="text-xl mb-3 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleSelect(post)}
                  >
                    {post.title}
                  </h2>

                  <div className="flex items-center mb-4 text-sm text-gray-500">
                    <span>
                      {new Date(post.date).toLocaleDateString("ko-KR")}{" "}
                      {new Date(post.date).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(post.tags || []).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
