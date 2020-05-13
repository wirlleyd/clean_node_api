import jwt from "jsonwebtoken";
import { Encrypter } from "../../../data/protocols/criptography/encrypter";
export class JwtAdapter implements Encrypter {
  secret: string;
  constructor(secret: string) {
    this.secret = secret;
  }
  async encrypt(value: string): Promise<string> {
    const token = await jwt.sign({ id: value }, this.secret);
    return token;
  }

  async decrypt(token: string): Promise<string> {
    const response = await jwt.verify(token, this.secret);
    return null;
  }
}
