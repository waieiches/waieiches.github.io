import { Button } from "./ui/button";

interface HeaderProps {
  currentView: "blog" | "about";
  onViewChange: (view: "blog" | "about") => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className="text-xl google-sans-code-title cursor-pointer"
              onClick={() => onViewChange("blog")}
            >
              waieiches
            </span>
          </div>

          <div className="flex items-center google-sans-code-title space-x-1">
            <Button
              variant={currentView === "blog" ? "default" : "ghost"}
              onClick={() => onViewChange("blog")}
              className="px-4"
            >
              blog
            </Button>
            <Button
              variant={currentView === "about" ? "default" : "ghost"}
              onClick={() => onViewChange("about")}
              className="px-4"
            >
              about
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
