import { Encrypter } from "../../data/protocols/encrypter";
import bcrypt from "bcrypt";
export class BcryptAdapter implements Encrypter {
  async encrypt(value: string): Promise<string> {
    await bcrypt.hash(value, 12);
    return null;
  }
}
