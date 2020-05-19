export type Answer = {
  image?: string;
  answer: string;
};

export interface SurveyModel {
  id: string;
  question: string;
  answers: Answer[];
  date: Date;
}
