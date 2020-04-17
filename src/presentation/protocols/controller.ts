import { HttpRequest, HttpResponse } from "./http";
import { AddAccount } from "../../domain/usecases/add-account";
export interface Controller {
  handle(httpRequest: HttpRequest, addAccount: AddAccount): HttpResponse;
}
