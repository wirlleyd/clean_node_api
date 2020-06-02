import {
  SaveSurveyResult,
  SaveSurveyResultModel,
} from "../../../../domain/usecases/save-survey-result";
import { SurveyResultModel } from "../../../../domain/models/survey-result";
import { MongoHelper } from "../helper/mongo-helper";
import { ObjectId } from "mongodb";

export class SurveyResultMongoRepository implements SaveSurveyResult {
  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      "surveysResults"
    );
    const survey = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(data.surveyId),
        accountId: new ObjectId(data.accountId),
      },
      {
        $set: {
          answer: data.answer,
          date: data.date,
        },
      },
      {
        upsert: true,
        returnOriginal: false,
      }
    );
    return survey.value && MongoHelper.map(survey.value);
  }
}
