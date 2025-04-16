import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Clock, Link as LinkIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useInterviewDetail } from '@/hooks/useInterviewDetail';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type TailQuestion = {
  tailQuestionId: number;
  answerState: AnswerState;
  question: string;
  answer: string;
  referenceLinks: string[];
  feedback: string;
};

type InterviewQuestion = {
  interviewQuestionId: number;
  answerState: AnswerState;
  question: string;
  answer: string;
  referenceLinks: string[];
  feedback: string;
  score: number;
  tailQuestions: TailQuestion[];
};

type InterviewState = 'PROGRESS' | 'COMPLETED' | 'FAILED';

type InterviewResult = {
  interviewId: number;
  interviewState: InterviewState;
  title: string;
  interviewQuestions: InterviewQuestion[];
  scoreGroup: {
    success: number;
    pass: number;
    fail: number;
  };
};

type AnswerState = 'INIT' | 'COMPLETE' | 'PASS';

type BadgeConfig = {
  variant: 'default' | 'destructive' | 'secondary' | 'outline';
  icon: any;
  text: string;
  className?: string;
};

const StatusBadge = ({ status }: { status: AnswerState }) => {
  const badges: Record<AnswerState, BadgeConfig> = {
    'INIT': {
      variant: "secondary",
      icon: Clock,
      text: "초기화",
      className: "text-xs lg:text-sm"
    },
    'COMPLETE': {
      variant: "default",
      icon: CheckCircle2,
      text: "완료",
      className: "bg-green-500 text-xs lg:text-sm"
    },
    'PASS': {
      variant: "outline",
      icon: XCircle,
      text: "넘김",
      className: "text-xs lg:text-sm"
    }
  };

  const badge = badges[status];
  const Icon = badge?.icon;

  return (
    <div className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 lg:px-2 lg:py-1 font-medium", {
      "bg-green-500 text-white": badge.variant === "default",
      "bg-destructive text-destructive-foreground": badge.variant === "destructive",
      "bg-secondary text-secondary-foreground": badge.variant === "secondary",
      [badge.className || ""]: true
    })}>
      <Icon className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
      {badge.text}
    </div>
  );
};

const StatisticCard = ({ icon: Icon, title, count, total, color, bgColor }: { 
  icon: any, title: string, count: number, total: number, color: string, bgColor: string 
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center">
        <Icon className={`w-4 h-4 mr-2 ${color}`} />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center mb-2">
        <span className={`font-bold ${color}`}>{count}/{total}</span>
        <span className="text-sm text-muted-foreground">
          {Math.round((count / total) * 100)}%
        </span>
      </div>
      <Progress 
        value={(count / total) * 100} 
        className={`h-2 ${bgColor}`} 
      />
    </CardContent>
  </Card>
);

const ReferenceLinks = ({ links }: { links: string[] }) => (
  <div className="space-y-2">
    {links.map((link, i) => (
      <div
        key={i}
        className="flex items-center text-primary hover:underline cursor-pointer text-xs lg:text-sm"
        onClick={() => window.open(link, '_blank')}
      >
        <LinkIcon className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 shrink-0" />
        <span className="break-all">{link}</span>
      </div>
    ))}
  </div>
);

const MAX_PREVIEW_LENGTH = 300; // 미리보기로 보여줄 최대 글자수

const CollapsibleText = ({ text, label }: { text: string; label: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldCollapse = text.length > MAX_PREVIEW_LENGTH;

  const previewText = shouldCollapse && !isExpanded 
    ? text.slice(0, MAX_PREVIEW_LENGTH) + '...' 
    : text;

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="rounded-md bg-muted p-3">
        <div className="text-sm break-words whitespace-pre-wrap">
          {previewText}
        </div>
        {shouldCollapse && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '접기' : '더 보기'}
          </Button>
        )}
      </div>
    </div>
  );
};

const MobileStatisticCard = ({ icon: Icon, title, count, total, color }: { 
  icon: any, title: string, count: number, total: number, color: string 
}) => (
  <div className="flex items-center justify-between p-3 border rounded-lg">
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-sm font-medium">{title}</span>
    </div>
    <div className="flex items-center gap-1">
      <span className={`font-bold ${color}`}>{count}</span>
      <span className="text-sm text-muted-foreground">/ {total}</span>
    </div>
  </div>
);

const QuestionItem = ({ 
  question, 
  index, 
  isExpanded, 
  onToggle 
}: { 
  question: InterviewQuestion;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-2 lg:px-0 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Label className="text-base lg:text-lg text-muted-foreground shrink-0">
              #{index + 1}
            </Label>
            <div className="space-y-1">
              <CardTitle className="text-sm lg:text-base leading-tight">
                {question.question}
              </CardTitle>
              {question.score >= 0 && (
                <CardDescription className="text-xs">
                  점수: {question.score}점
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={question.answerState} />
            {question.tailQuestions?.length > 0 && (
              <button
                onClick={onToggle}
                className="p-1 hover:bg-accent rounded-md"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 lg:px-0 space-y-4">
        {question.answer && (
          <CollapsibleText text={question.answer} label="답변" />
        )}

        {question.feedback && (
          <CollapsibleText text={question.feedback} label="피드백" />
        )}

        {question.referenceLinks?.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-xs">참고 자료</Label>
            <div className="rounded-md bg-muted p-3">
              <ReferenceLinks links={question.referenceLinks} />
            </div>
          </div>
        )}

        {isExpanded && question.tailQuestions?.length > 0 && (
          <div className="space-y-3 pl-4 mt-4 border-l-2">
            <Label className="text-xs text-muted-foreground">
              추가 질문 {question.tailQuestions.length}개
            </Label>
            {question.tailQuestions.map((tailQ, idx) => (
              <Card key={tailQ.tailQuestionId} className="bg-muted/30">
                <CardHeader className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {idx + 1}
                      </span>
                      <StatusBadge status={tailQ.answerState} />
                    </div>
                  </div>
                  <CardTitle className="text-sm mt-2">{tailQ.question}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-3">
                  {tailQ.answer && (
                    <CollapsibleText text={tailQ.answer} label="답변" />
                  )}
                  {tailQ.feedback && (
                    <CollapsibleText text={tailQ.feedback} label="피드백" />
                  )}
                  {tailQ.referenceLinks?.length > 0 && (
                    <div className="rounded-md bg-muted p-3">
                      <ReferenceLinks links={tailQ.referenceLinks} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function InterviewDetail() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const { data, isLoading, error } = useInterviewDetail<InterviewResult>(interviewId!);
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  const toggleQuestion = (id: number) => {
    setExpandedQuestions(prev => 
      prev.includes(id) 
        ? prev.filter(qId => qId !== id)
        : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-10">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">오류가 발생했습니다</CardTitle>
            <CardDescription>{(error as Error)?.message || '데이터를 불러올 수 없습니다.'}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalQuestions = data.interviewQuestions?.length ?? 0;
  const answeredQuestions = data.interviewQuestions?.filter(q => q.answerState !== 'INIT').length ?? 0;
  const passedQuestions = data.interviewQuestions?.filter(q => q.answerState === 'PASS').length ?? 0;
  const failedQuestions = data.interviewQuestions?.filter(q => q.answerState === 'FAIL').length ?? 0;
  const skippedQuestions = data.interviewQuestions?.filter(q => q.answerState === 'SKIP').length ?? 0;

  const statistics = [
    {
      icon: CheckCircle2,
      title: "성공한 문제",
      count: data.scoreGroup.success,
      total: totalQuestions,
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      icon: CheckCircle2,
      title: "건너뛴 문제",
      count: data.scoreGroup.pass,
      total: totalQuestions,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100"
    },
    {
      icon: XCircle,
      title: "실패한 문제",
      count: data.scoreGroup.fail,
      total: totalQuestions,
      color: "text-red-500",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <div className="container py-4 px-2 lg:px-4 lg:py-6 space-y-4 lg:space-y-6 max-w-full lg:max-w-7xl">
      <Card className="shadow-none lg:shadow">
        <CardHeader className="p-3 lg:p-6 space-y-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()} 
              className="-ml-2 px-2"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-base lg:text-xl line-clamp-1">{data.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={
              data.interviewState === 'DONE' ? 'default' :
              data.interviewState === 'PROGRESS' ? 'destructive' : 'secondary'
            } className="text-xs">
              {data.interviewState === 'DONE' ? '완료' : 
               data.interviewState === 'PROGRESS' ? '실패' : '진행 중'}
            </Badge>
            <CardDescription className="text-xs lg:text-sm">
              <span className="hidden lg:inline">면접 결과를 확인하고 개선할 점을 파악해보세요.</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-3 lg:p-6 space-y-4 lg:space-y-6">
          {/* 전체 통계 */}
          <Card className="shadow-sm">
            <CardHeader className="p-3 lg:p-6 pb-2 lg:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm lg:text-lg">전체 통계</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {answeredQuestions}/{totalQuestions} 완료
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 lg:p-6 pt-2 lg:pt-3">
              {/* 데스크톱 통계 */}
              <div className="hidden lg:grid gap-4 grid-cols-3">
                {statistics.map((stat, index) => (
                  <StatisticCard key={index} {...stat} />
                ))}
              </div>
              {/* 모바일 통계 */}
              <div className="lg:hidden space-y-2">
                {statistics.map((stat, index) => (
                  <MobileStatisticCard key={index} {...stat} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 문제별 상세 결과 */}
          <div className="space-y-3 lg:space-y-4">
            <h3 className="text-sm lg:text-lg font-semibold px-1">문제별 상세 결과</h3>
            <div className="space-y-3 lg:space-y-4">
              {data.interviewQuestions?.map((question, index) => (
                <QuestionItem
                  key={question.interviewQuestionId}
                  question={question}
                  index={index}
                  isExpanded={expandedQuestions.includes(question.interviewQuestionId)}
                  onToggle={() => toggleQuestion(question.interviewQuestionId)}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
