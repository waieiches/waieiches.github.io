import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Download,
  Award,
  Users,
  Code,
  BookOpen,
} from "lucide-react";
import ProfileImage from "../assets/profileImage.png";

const experiences = [
  {
    company: "company",
    position: "position",
    period: "period",
    description: "descrition",
    achievements: ["achievement1", "achievement2", "achievement3"],
  },
];

const skills = {
  frontend: [
    "React",
    "Vue.js",
    "TypeScript",
    "Next.js",
    "Nuxt.js",
    "Tailwind CSS",
    "Sass",
    "Webpack",
  ],
  backend: [
    "Node.js",
    "Python",
    "FastAPI",
    "Express",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "GraphQL",
  ],
  devops: ["Docker", "AWS", "GitHub Actions", "Linux"],
  tools: ["Git", "VS Code", "Figma", "Postman", "Jira", "Slack"],
};

const stats = [
  { icon: Code, label: "프로젝트 완료", value: "" },
  { icon: Users, label: "협업 경험", value: "" },
  { icon: BookOpen, label: "블로그 포스트", value: "" },
  { icon: Award, label: "개발 경력", value: "" },
];

export function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Profile Section */}
      <section className="text-center mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <ImageWithFallback
              src={ProfileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
            />
            <h1 className="mb-4">Hyeonseo Yu</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              이것저것 공부하고 기록하는 공간입니다
            </p>
            <div className="flex justify-center items-center space-x-6 text-muted-foreground mb-8">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Seoul, Korea
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                toastome@naver.com
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <a
                href="https://github.com/waieiches"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </a>
              <a
                href="https://www.linkedin.com/in/hyeonseo-yu-574b78359/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl mb-1">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-16">
        <h2 className="text-center mb-12">기술 스택</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Frontend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.frontend.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Backend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.backend.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">DevOps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.devops.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-16">
        <h2 className="text-center mb-12">경력</h2>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-lg">{exp.position}</CardTitle>
                    <p className="text-primary">{exp.company}</p>
                  </div>
                  <Badge variant="outline">{exp.period}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{exp.description}</p>
                <div>
                  <p className="mb-2">주요 성과:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section
      <section className="text-center">
        <h2 className="mb-8">함께 일해요</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          새로운 프로젝트나 협업 기회가 있으시면 언제든 연락해 주세요. 흥미로운
          도전과 함께 성장할 수 있는 기회를 찾고 있습니다.
        </p>
        <Button size="lg">
          <Mail className="w-4 h-4 mr-2" />
          연락하기
        </Button>
      </section> */}
    </div>
  );
}
