import React, { useState } from "react";
import { Header } from "./components/Header";
import { BlogList } from "./components/BlogList";
import { BlogPost } from "./components/BlogPost";
import { About } from "./components/About";
import type { BlogPostType } from "./types/blog";

export default function App() {
  const [currentView, setCurrentView] = useState("blog" as "blog" | "about");
  const [selectedPost, setSelectedPost] = useState<BlogPostType | null>(null);

  const handleViewChange = (view: "blog" | "about") => {
    setCurrentView(view);
    setSelectedPost(null);
  };

  const handlePostSelect = (post: BlogPostType) => {
    setSelectedPost(post);
  };

  const handleBackToBlog = () => {
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      <main className="pt-[112px] space-y-12">
        <div className="scaled-container">
          {selectedPost ? (
            <div className="mb-12">
              <BlogPost post={selectedPost} onBack={handleBackToBlog} />
            </div>
          ) : (
            <>
              {currentView === "blog" && (
                <div className="mb-12">
                  <BlogList
                    onPostSelect={handlePostSelect}
                    onViewChange={handleViewChange}
                  />
                </div>
              )}
              {currentView === "about" && (
                <div className="mb-12">
                  <About />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
