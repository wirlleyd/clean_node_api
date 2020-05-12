import { Controller } from "../../../../presentation/protocols";
import { LoginController } from "../../../../presentation/controllers/login/login/login-controller";
import { makeLoginValidator } from "./login-validation-factory";
import { makeDbAuthentication } from "../../usecases/authentication/db-authentication-factory";
import { makeLogControllerDecorator } from "../../decorators/log-controller-decorator-factory";

export const makeLoginControler = (): Controller => {
  return makeLogControllerDecorator(
    new LoginController(makeLoginValidator(), makeDbAuthentication())
  );
};
