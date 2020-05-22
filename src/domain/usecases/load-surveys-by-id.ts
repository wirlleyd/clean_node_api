import { SurveyModel } from "../models/survey";

export interface LoadSurveysById {
  loadById(id: string): Promise<SurveyModel>;
}
