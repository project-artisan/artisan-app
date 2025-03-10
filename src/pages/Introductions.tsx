import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, ExternalLink, MessageSquare, FileText, BookOpen, Sparkles, Code, Rocket } from "lucide-react";

export default function Introductions() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* 헤더 섹션 */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <img 
              src="favicon/favicon-192.png" 
              alt="Project Artisan Logo" 
              className="w-52 h-52 mb-4"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Project Artisan</h1>
            <p className="text-xl text-muted-foreground">
                아티장이 되는 그날까지
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.open('https://github.com/JaehongDev', '_blank')}
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
              <Button
                onClick={() => window.location.href = '/blogs/tech'}
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                시작하기
              </Button>
            </div>
          </div>
        </div>

        {/* 현재 제공 기능 섹션 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">현재 제공 기능</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  기술 블로그 모음
                </CardTitle>
                <CardDescription>
                  국내 IT 기업들의 기술 블로그를 한눈에
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  여러 회사의 기술 블로그 글을 한 곳에서 모아볼 수 있습니다.
                  최신 기술 트렌드와 실무 경험을 손쉽게 파악하세요.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  AI 면접 연습
                </CardTitle>
                <CardDescription>
                  AI와 함께하는 기술 면접 대비
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  실제 면접과 유사한 환경에서 AI와 함께 면접 연습을 해보세요.
                  즉각적인 피드백으로 더 나은 답변을 준비할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 향후 제공 예정 기능 섹션 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              향후 제공 예정 기능
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-6 w-6" />
                  옵시디언 마크다운 파서
                </CardTitle>
                <CardDescription>
                    옵시디언 마크다운 에서 개인 블로그
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                    옵시디언 마크다운을 파싱하여 블로그로 제공하는 기능 
                </p>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-6 w-6" />
                  Algorithm Visualizer
                </CardTitle>
                <CardDescription>
                    알고리즘 시각화화 프로젝트
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                    OPGC 
                </p>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-6 w-6" />
                  과거 OPGC 프로젝트 되살리기
                </CardTitle>
                <CardDescription>
                    알고리즘 시각화화 프로젝트
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                    1일 1커밋 순위 보여주는 기능
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 프로젝트 소개 섹션 */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">프로젝트 진행 이유</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-center text-muted-foreground">
              Project Artisan은 개발자들의 학습과 성장을 돕기 위해 만들어졌습니다.
              여러 회사의 기술 블로그를 한 곳에서 볼 수 있고,
              AI를 활용한 면접 연습으로 실전 감각을 키울 수 있습니다.
            </p>
          </div>
        </div>

        {/* 푸터 */}
        <footer className="text-center text-sm text-muted-foreground">
          <p>© 2025 Project Artisan. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
} 