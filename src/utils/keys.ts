import { Keypair } from "@solana/web3.js";
import base58 from "bs58";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";

// Expects privateKey is a base58 encoded string
export function publicKeyFromPrivateKey(privateKey: string) {
    return Keypair.fromSecretKey(base58.decode(privateKey)).publicKey;
}

export function getKeypairFromMnemonicSeed(seed: string, derivationIndex: number) {
    const derivedSeed = derivePath(`m/44'/501'/${derivationIndex}'/0'`, seed).key;

    return Keypair.fromSecretKey(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey);
}
