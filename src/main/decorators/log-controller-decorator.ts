import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogErrorRepository } from "../../data/protocols/db/log/log-error-repository";
export class LogControllerDecorator implements Controller {
  controller: Controller;
  logErrorRepository: LogErrorRepository;

  constructor(
    controller: Controller,
    logErrorRepositoryStub: LogErrorRepository
  ) {
    this.controller = controller;
    this.logErrorRepository = logErrorRepositoryStub;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode < 200 || httpResponse.statusCode > 300) {
      await this.logErrorRepository.logError(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
