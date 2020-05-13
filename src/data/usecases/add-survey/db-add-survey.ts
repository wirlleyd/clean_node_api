import { AddSurvey, AddSurveyModel } from "../../../domain/usecases/add-survey";
import { AddSurveyRepository } from "../../protocols/db/survey/add-survey-repository";

export class DbAddSurvey implements AddSurvey {
  addSurveyRepository: AddSurveyRepository;
  constructor(addSurveyRepository: AddSurveyRepository) {
    this.addSurveyRepository = addSurveyRepository;
  }
  async add(data: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(data);
  }
}
