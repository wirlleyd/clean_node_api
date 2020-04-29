import { Hasher } from "../../data/protocols/criptography/hasher";
import bcrypt from "bcrypt";
export class BcryptAdapter implements Hasher {
  async hash(value: string): Promise<string> {
    const hashValue = await bcrypt.hash(value, 12);
    return hashValue;
  }
}
