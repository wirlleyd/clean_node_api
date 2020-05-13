import { AccountModel } from "../models/account";

type Answer = {
  image?: string;
  answer: string;
};

export interface AddSurveyModel {
  question: string;
  answers: Answer[];
}

export interface AddSurvey {
  add(data: AddSurveyModel): Promise<void>;
}
