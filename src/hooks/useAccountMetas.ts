import base58 from "bs58";
import nacl, { randomBytes } from "tweetnacl";
import { useLocalStorage } from "usehooks-ts";
import { PROJECT_CODENAME } from "../config";
import { MakeOptional } from "../types/utils";
import { deriveEncryptionKey, hashString } from "../utils/encryption";
import { secretbox } from "tweetnacl";
import { getKeypairFromMnemonicSeed, publicKeyFromPrivateKey } from "../utils/keys";
import useHashedPassword from "./useHashedPassword";
import { mnemonicToSeed } from "bip39";

export const ACCOUNT_METAS_KEY = PROJECT_CODENAME + "__accountMetas";

export enum DerivationPath {
    Bip44Root = `m/44'/501'`,
    Bip44 = `m/44'/501'/0'`,
    Bip44Change = `m/44'/501'/0'/0'`,
}

export enum AccountMetaType {
    HD_BASE = "hd-base",
    HD_DERIVED = "hd-derived",
    PRIVATE_KEY = "private-key",
}

export interface BaseEncryption<T> {
    data: T;
    salt: string;
    nonce: string;
    kdf: string;
    iterations: number;
    digest: string;
}

export interface HDAccountMetaDerivation {
    hashedMnemonic: string;
    pathType: DerivationPath;
    index: number;
}

export interface HDAccountMetaData {
    mnemonic: string;
    seed: string;
}

export interface PrivateKeyAccountMetaData {
    privateKey: string;
}

export interface BaseAccountMeta<E, D, T> {
    name: string;

    publicKey: string;

    encryption: BaseEncryption<E>;

    derivation?: D;

    type: T;
}

export type BaseEncryptedAccountMeta<D, T> = BaseAccountMeta<string, D, T>;

export type EncryptedHDBaseAccountMeta = BaseEncryptedAccountMeta<HDAccountMetaDerivation, AccountMetaType.HD_BASE>;
export type EncryptedHDDerivedAccountMeta = BaseEncryptedAccountMeta<
    HDAccountMetaDerivation,
    AccountMetaType.HD_DERIVED
>;
export type EncryptedPrivateKeyAccountMeta = BaseEncryptedAccountMeta<undefined, AccountMetaType.PRIVATE_KEY>;

export type EncryptedAccountMeta =
    | EncryptedHDBaseAccountMeta
    | EncryptedHDDerivedAccountMeta
    | EncryptedPrivateKeyAccountMeta;

export type DecryptedHDBaseAccountMeta = BaseAccountMeta<
    HDAccountMetaData,
    HDAccountMetaDerivation,
    AccountMetaType.HD_BASE
>;
export type DecryptedHDDerivedAccountMeta = BaseAccountMeta<
    HDAccountMetaData,
    HDAccountMetaDerivation,
    AccountMetaType.HD_DERIVED
>;
export type DecryptedPrivateKeyAccountMeta = BaseAccountMeta<
    PrivateKeyAccountMetaData,
    HDAccountMetaDerivation,
    AccountMetaType.PRIVATE_KEY
>;

export type DecryptedAccountMeta =
    | DecryptedHDBaseAccountMeta
    | DecryptedHDDerivedAccountMeta
    | DecryptedPrivateKeyAccountMeta;

export type DecryptedAccountMetaData = HDAccountMetaData | PrivateKeyAccountMetaData;

export default function useAccountMetas() {
    const [hashedPassword] = useHashedPassword();
    const [accountMetas, setAccountMetas] = useLocalStorage<EncryptedAccountMeta[]>(ACCOUNT_METAS_KEY, []);

    async function createPrivateKeyAccountMeta({ privateKey }: PrivateKeyAccountMetaData) {
        if (!hashedPassword) {
            throw new Error("Missing hashedPassword when creating account meta");
        }

        const { encrypted, digest, iterations, kdf, nonce, salt } = await encryptData(hashedPassword, { privateKey });

        const newAccountMeta: EncryptedPrivateKeyAccountMeta = {
            publicKey: publicKeyFromPrivateKey(privateKey).toString(),
            name: `Wallet ${accountMetas.length + 1}`,
            encryption: {
                data: encrypted,
                digest,
                iterations,
                kdf,
                nonce,
                salt,
            },
            derivation: undefined,
            type: AccountMetaType.PRIVATE_KEY,
        };

        setAccountMetas((oldAccountMetas) => {
            oldAccountMetas.push(newAccountMeta);
            return oldAccountMetas;
        });
    }

    async function createHDBaseAccountMeta({ mnemonic }: Omit<HDAccountMetaData, "seed">) {
        if (!hashedPassword) {
            throw new Error("Missing hashedPassword when creating account meta");
        }

        const seed = await mnemonicToSeed(mnemonic);

        console.log({ seed, string: seed.toString("hex") });

        const { encrypted, digest, iterations, kdf, nonce, salt } = await encryptData(hashedPassword, {
            mnemonic,
            seed: seed.toString("hex"),
        });

        const keypair = getKeypairFromMnemonicSeed(seed.toString("hex"), 0);

        const newAccountMeta: EncryptedHDBaseAccountMeta = {
            publicKey: keypair.publicKey.toString(),
            name: `Wallet ${accountMetas.length + 1}`,
            encryption: {
                data: encrypted,
                digest,
                iterations,
                kdf,
                nonce,
                salt,
            },
            derivation: {
                hashedMnemonic: hashString(mnemonic),
                pathType: DerivationPath.Bip44Change,
                index: 0,
            },
            type: AccountMetaType.HD_BASE,
        };

        setAccountMetas((oldAccountMetas) => {
            oldAccountMetas.push(newAccountMeta);
            return oldAccountMetas;
        });
    }

    function removeByIndex(index: number) {
        setAccountMetas((oldAccountMetas) => oldAccountMetas.filter((item, i) => i !== index));
    }

    function updateName() {}

    return {
        accountMetas,
        setAccountMetas,
        removeByIndex,
        createHDBaseAccountMeta,
        createPrivateKeyAccountMeta,
    };
}

async function encryptData(hashedPassword: string, data: DecryptedAccountMetaData) {
    const plainText = JSON.stringify(data);

    const salt = randomBytes(16);
    const kdf = "pbkdf2";
    const iterations = 5000;
    const digest = "sha256";
    const key = await deriveEncryptionKey(hashedPassword, salt, iterations, digest);
    const nonce = randomBytes(secretbox.nonceLength);

    const encrypted = secretbox(Buffer.from(plainText), nonce, key);

    return {
        encrypted: base58.encode(encrypted),
        salt: base58.encode(salt),
        nonce: base58.encode(nonce),
        kdf,
        iterations,
        digest,
    };
}
