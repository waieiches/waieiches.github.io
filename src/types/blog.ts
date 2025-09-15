export type BlogPostType = {
  id: string;
  title: string;
  excerpt: string;
  content: string;     // markdown 원문
  category: string;
  date: string;        // ISO 문자열
  readTime?: string;
  tags: string[];
};
