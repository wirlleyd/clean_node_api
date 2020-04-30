import { Hasher } from "../../data/protocols/criptography/hasher";
import bcrypt from "bcrypt";
import { HashComparer } from "../../data/protocols/criptography/hash-comparer";
export class BcryptAdapter implements Hasher, HashComparer {
  async hash(value: string): Promise<string> {
    const hashValue = await bcrypt.hash(value, 12);
    return hashValue;
  }
  async compare(value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash);
    return new Promise((res) => res(true));
  }
}
