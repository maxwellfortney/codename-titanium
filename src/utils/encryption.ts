import nacl, { secretbox } from "tweetnacl";
import { pbkdf2Sync, BinaryLike } from "crypto";
import base58 from "bs58";

export async function deriveEncryptionKey(
    hashedPassword: string,
    salt: Uint8Array,
    iterations: number,
    digest: string
) {
    return pbkdf2Sync(hashedPassword, salt, iterations, secretbox.keyLength, digest);
}

export function hashString(input: string) {
    return base58.encode(nacl.hash(new TextEncoder().encode(input)));
}
