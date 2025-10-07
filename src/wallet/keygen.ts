import crypto from "crypto";

export class Keygen {
  static generateKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    return { publicKey, privateKey };
  }

  static validateKey(publicKey: string): boolean {
    return publicKey.includes("BEGIN PUBLIC KEY");
  }
}
