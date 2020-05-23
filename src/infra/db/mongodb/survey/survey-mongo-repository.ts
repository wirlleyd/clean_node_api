import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { AddSurveyModel } from "../../../../domain/usecases/add-survey";
import { MongoHelper } from "../helper/mongo-helper";
import { LoadSurveyRepository } from "../../../../data/protocols/db/survey/load-survey-repository";
import { SurveyModel } from "../../../../domain/models/survey";
import { LoadSurveyByIdRepository } from "../../../../data/protocols/db/survey/load-survey-by-id-repository";
export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveyRepository,
    LoadSurveyByIdRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(surveyData);
  }
  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const surveys: SurveyModel[] = await surveyCollection.find().toArray();
    return surveys;
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const survey: SurveyModel = await surveyCollection.findOne({ _id: id });
    return survey;
  }
}
