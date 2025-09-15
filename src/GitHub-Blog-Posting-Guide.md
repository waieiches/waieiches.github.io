### 마크다운 파일 사용 (고급)

#### 3.1 마크다운 파일 구조
`/posts/` 디렉토리에 마크다운 파일을 생성합니다:

```
/posts/
  ├── react-18-features.md
  ├── typescript-5-guide.md
  └── ...
```

#### 3.2 마크다운 파일 형식
각 마크다운 파일 상단에 메타데이터를 추가합니다:

```markdown
---
id: "1"
title: "React 18의 새로운 기능들"
excerpt: "React 18에서 도입된 Concurrent Features에 대해..."
category: "React"
date: "2024-01-15"
readTime: "8분"
tags: ["React", "JavaScript", "Frontend"]
---

# React 18의 새로운 기능들

실제 글 내용...
```

#### 3.3 마크다운 파서 설치
```bash
npm install gray-matter remark remark-html
```

#### 3.4 마크다운 로더 구현
```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames.map((name) => {
    const fullPath = path.join(postsDirectory, name);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      ...data,
      content,
    };
  });
  
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}
```

## 4. 새 글 작성 워크플로우

### 4.1 개발 환경에서 작성
1. 로컬에서 개발 서버 실행: `npm run dev`
2. 새 글 추가 (위 방법 중 하나 사용)
3. 브라우저에서 확인

### 4.2 배포
1. 변경사항을 Git에 커밋
```bash
git add .
git commit -m "새 글 추가: [글 제목]"
git push origin main
```

2. GitHub Actions가 자동으로 빌드 및 배포 실행
3. 몇 분 후 `https://username.github.io`에서 확인

## 5. 추가 개선사항

### 5.1 글 작성 도구
- **온라인 마크다운 에디터** 사용 (Typora, Mark Text 등)
- **VS Code**의 마크다운 미리보기 기능 활용
- **GitHub Web Editor**에서 직접 편집

### 5.2 이미지 관리
1. `/public/images/` 폴더에 이미지 저장
2. 마크다운에서 상대 경로로 참조:
```markdown
![이미지 설명](/images/example.jpg)
```

### 5.3 SEO 최적화
- 각 글에 메타 태그 추가
- sitemap.xml 생성
- robots.txt 설정

### 5.4 댓글 시스템
- **Giscus** (GitHub Discussions 기반)
- **Utterances** (GitHub Issues 기반)
- **Disqus** 연동

## 6. 트러블슈팅

### 6.1 빌드 실패
- `package.json`의 스크립트 확인
- 의존성 설치 상태 확인
- 마크다운 문법 오류 확인

### 6.2 이미지 로딩 실패
- 이미지 경로 확인
- 파일 크기 및 형식 확인
- GitHub Pages의 파일 크기 제한 (100MB) 확인

### 6.3 스타일링 문제
- CSS/Tailwind 클래스 확인
- 빌드된 파일의 경로 문제 확인

## 7. 유용한 리소스

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)
- [마크다운 가이드](https://www.markdownguide.org/)
- [React + TypeScript 가이드](https://react-typescript-cheatsheet.netlify.app/)

---

이 가이드를 따라하시면 GitHub Pages에서 블로그를 운영하고 새로운 글을 쉽게 추가할 수 있습니다. 추가 질문이 있으시면 언제든지 문의해주세요!