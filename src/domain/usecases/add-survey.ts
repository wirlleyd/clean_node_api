import { AccountModel } from "../models/account";
import { Answer } from '../models/survey'

export interface AddSurveyModel {
  question: string;
  answers: Answer[];
  date: Date;
}

export interface AddSurvey {
  add(data: AddSurveyModel): Promise<void>;
}
