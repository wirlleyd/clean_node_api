import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";

export class LogControllerDecorator implements Controller {
  controller: Controller;
  constructor(controller: Controller) {
    this.controller = controller;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode != 200) {
      //TODO: implementar log
      console.error(httpRequest.body);
    }
    return httpResponse;
  }
}
