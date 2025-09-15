import React, { JSX, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, List } from "lucide-react";
import type { BlogPostType } from "../types/blog";
import ProfileImage from "../assets/profileImage.png";

interface BlogPostProps {
  post: BlogPostType;
  onBack: () => void;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

type PostMeta = Omit<BlogPostType, "content"> & { file?: string };

export function BlogPost({ post, onBack }: BlogPostProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const [relatedPosts, setRelatedPosts] = useState<PostMeta[]>([]);

  // 관련 글: manifest에서 같은 카테고리 5개까지
  useEffect(() => {
    fetch("/_posts/index.json")
      .then((r) => r.json())
      .then((items: PostMeta[]) => {
        const rel = items
          .filter((p) => p.category === post.category && p.id !== post.id)
          .slice(0, 5);
        setRelatedPosts(rel);
      })
      .catch((e) => console.error("related posts load error:", e));
  }, [post.category, post.id]);

  // 목차 추출
  useEffect(() => {
    const lines = post.content.split(/\r?\n/);
    const tocItems: TocItem[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = text.toLowerCase().replace(/[^a-z0-9가-힣]/g, "-");
        tocItems.push({ id, text, level });
      }
    });

    setToc(tocItems);
  }, [post.content]);

  // 스크롤 시 현재 섹션 하이라이트
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6");
      let current = "";
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) current = heading.id;
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Markdown 아주 간단 렌더러
  const renderContent = (content: string) => {
    const lines = content.split(/\r?\n/);
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeContent = "";
    let codeLanguage = "";

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace("```", "");
          codeContent = "";
        } else {
          inCodeBlock = false;
          elements.push(
            <pre key={index} className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
              <code className={`language-${codeLanguage}`}>{codeContent}</code>
            </pre>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + "\n";
        return;
      }

      // Headers
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
        const text = headerMatch[2];
        const id = text.toLowerCase().replace(/[^a-z0-9가-힣]/g, "-");

        const Tag = (`h${level}` as keyof JSX.IntrinsicElements); // 타입 안전하게
        elements.push(
          <Tag key={index} id={id} className="scroll-mt-20">
            {text}
          </Tag>
        );
        return;
      }

      // Inline code / strong / em
      const processInlineElements = (t: string) =>
        t
          .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/\*([^*]+)\*/g, "<em>$1</em>");

      // Paragraphs
      if (line.trim()) {
        elements.push(
          <p key={index} dangerouslySetInnerHTML={{ __html: processInlineElements(line) }} />
        );
      } else {
        elements.push(<br key={index} />);
      }
    });

    return elements;
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-40">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="prose prose-gray max-w-none">
              <div className="mb-8">
                <div className="text-sm text-gray-500 mb-3">{post.category}</div>

                <h1 className="text-3xl mb-4">{post.title}</h1>

                <div className="flex items-center mb-6 text-sm text-gray-500">
                  <img
                    src={ProfileImage}
                    alt="Author"
                    className="w-6 h-6 rounded-full mr-2 object-cover"
                  />
                  <span>
                    {new Date(post.date).toLocaleDateString("ko-KR")}{" "}
                    {new Date(post.date).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="space-y-4">{renderContent(post.content)}</div>

              {/* Related Posts Section */}
              {relatedPosts.length > 0 && (
                <div className="mt-16 pt-8 border-t border-gray-200">
                  <h3 className="text-xl mb-6">관련 글 목록</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg">
                        {post.category} {relatedPosts.length + 1}개의 글
                      </h4>
                      <button className="text-blue-600 text-sm hover:underline">
                        목록달기
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-12 gap-4 text-sm text-gray-600 border-b pb-2">
                        <div className="col-span-6">글 제목</div>
                        <div className="col-span-2">조회수</div>
                        <div className="col-span-2">작성일</div>
                      </div>

                      {/* Current post */}
                      <div className="grid grid-cols-12 gap-4 text-sm py-2 bg-blue-50 rounded">
                        <div className="col-span-6 flex items-center">
                          <span className="mr-2">{post.title}</span>
                          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">
                            {post.category}
                          </span>
                        </div>
                        <div className="col-span-2">0</div>
                        <div className="col-span-2 text-gray-500">
                          {new Date(post.date)
                            .toLocaleDateString("ko-KR")
                            .replace(/\./g, ". ")}
                        </div>
                      </div>

                      {/* Related posts (manifest 기반) */}
                      {relatedPosts.map((p) => (
                        <div
                          key={p.id}
                          className="grid grid-cols-12 gap-4 text-sm py-2 hover:bg-gray-100 rounded cursor-default"
                        >
                          <div className="col-span-6 flex items-center">
                            <span className="mr-2">{p.title}</span>
                            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs">
                              {p.category}
                            </span>
                          </div>
                          <div className="col-span-2">0</div>
                          <div className="col-span-2 text-gray-500">
                            {new Date(p.date)
                              .toLocaleDateString("ko-KR")
                              .replace(/\./g, ". ")}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination (스타일 유지용 더미) */}
                    <div className="flex justify-center mt-6 space-x-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          className={`w-8 h-8 text-sm rounded ${
                            num === 1
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <button className="text-gray-600 hover:bg-gray-200 px-2 py-1 rounded text-sm">
                        다음 &gt;
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <List className="w-4 h-4 mr-2" />
                    <span className="text-sm">목차</span>
                  </div>
                  <nav className="space-y-2">
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                          activeSection === item.id
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                        style={{
                          marginLeft: `${(item.level - 1) * 12}px`,
                          fontSize: item.level === 1 ? "0.875rem" : "0.8rem",
                        }}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
