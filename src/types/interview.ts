export interface InterviewCategory {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon?: string;
}

export const interviewCategories: InterviewCategory[] = [
  {
    id: 'frontend',
    title: '프론트엔드',
    titleEn: 'Frontend',
    description: '프론트엔드 개발자를 위한 기술 면접 질문들을 연습해보세요.',
  },
  {
    id: 'backend',
    title: '백엔드',
    titleEn: 'Backend',
    description: '백엔드 개발자를 위한 기술 면접 질문들을 연습해보세요.',
  },
  {
    id: 'devops',
    title: '데브옵스',
    titleEn: 'DevOps',
    description: '데브옵스 엔지니어를 위한 기술 면접 질문들을 연습해보세요.',
  }
];

export interface Question {
  id: string;
  content: string;
  followUps: FollowUpQuestion[];
}

export interface FollowUpQuestion {
  id: string;
  content: string;
  condition?: string; // 꼬리질문이 나타나는 조건 (예: 키워드 포함)
}

export interface QuestionSet {
  questionSetId: string;
  title: string;
  description: string;
  count: number;
  tailQuestionDepth: number;
  thumbnailUrl: string;
  questions?: Question[];
}
export enum AnswerState {
  INIT = "INIT",
  PASS = "PASS",
  COMPLETE = "COMPLETE"
}

export interface InterviewQuestionResponse {
  interviewId: number;
  interviewQuestionId: number;
  question: string;
  index: number;
  size: number;
  remainTailQuestionCount: number;
}

export interface InterviewSubmitRequest {
  interviewId: number;
  interviewQuestionId: number;
  currentIndex: number;
  answerState: AnswerState;
  aiFeedback: string;
  tailQuestion: string;
  timeToAnswer: number;
  answerContent: string;
  score: number;
  referenceLinks: string[];
}

export interface OngoingInterview {
  id: number;
  title: string;
  category: InterviewCategory;
  questionSet: QuestionSet;
  progress: {
    currentQuestionIndex: number;
    totalQuestions: number;
    completedQuestions: number;
    remainingQuestions: number;
  };
  status: 'in-progress' | 'paused';
  startedAt: string;
  lastUpdated: string;
  answers: {
    questionId: number;
    content: string;
    timestamp: string;
  }[];
}

