import { AccountModel } from "../models/account";

export interface LoadAccountByToken {
  load(accessToken: String, role?: string): Promise<AccountModel>;
}
