import base58 from "bs58";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import useAccountMetas, { DecryptedAccountMeta, DecryptedAccountMetaData } from "./useAccountMetas";
import { secretbox } from "tweetnacl";
import { deriveEncryptionKey, hashString } from "../utils/encryption";
import useHashedPassword from "./useHashedPassword";
import useActiveAccountIndex from "./useActiveAccountIndex";

export interface IUnlockContext {
    unlockedAccountMeta: DecryptedAccountMeta | undefined;
    unlock: (password?: string) => Promise<DecryptedAccountMeta>;
}

export const UnlockContext = createContext({} as IUnlockContext);

export default function UnlockProvider({ children }: { children: ReactNode }) {
    const [hashedPassword, setHashedPassword] = useHashedPassword();

    const { activeAccountIndex } = useActiveAccountIndex();
    const { accountMetas } = useAccountMetas();

    const [unlockedAccountMeta, setUnlockedAccountMeta] = useState<DecryptedAccountMeta | undefined>(undefined);

    const activeAccount = accountMetas[activeAccountIndex];

    async function unlock(password?: string) {
        if (!activeAccount) {
            throw new Error("Cannot unlock when no activeAccount is found");
        }

        let _hashedPassword = password ? hashString(password) : hashedPassword!;

        if (!_hashedPassword) {
            throw new Error("No hashed password found");
        }

        const encryptedData = base58.decode(activeAccount.encryption.data);
        const nonce = base58.decode(activeAccount.encryption.nonce);
        const salt = base58.decode(activeAccount.encryption.salt);
        const key = await deriveEncryptionKey(
            _hashedPassword,
            salt,
            activeAccount.encryption.iterations,
            activeAccount.encryption.digest
        );

        const plaintext = secretbox.open(encryptedData, nonce, key);

        if (!plaintext) {
            throw new Error("Incorrect password");
        }

        setHashedPassword(_hashedPassword);

        const parsed = JSON.parse(Buffer.from(plaintext).toString()) as DecryptedAccountMetaData;

        const _unlockedAccountMeta = {
            name: activeAccount.name,
            encryption: {
                data: parsed,
                digest: activeAccount.encryption.digest,
                iterations: activeAccount.encryption.iterations,
                kdf: activeAccount.encryption.kdf,
                nonce: activeAccount.encryption.nonce,
                salt: activeAccount.encryption.salt,
            },
            derivation: activeAccount.derivation,
            publicKey: activeAccount.publicKey,
            type: activeAccount.type,
        } as DecryptedAccountMeta;

        setUnlockedAccountMeta(_unlockedAccountMeta);

        return _unlockedAccountMeta;
    }

    useEffect(() => {
        if (hashedPassword) {
            unlock();
        }
    }, [activeAccountIndex]);

    return <UnlockContext.Provider value={{ unlockedAccountMeta, unlock }}>{children}</UnlockContext.Provider>;
}

export function useUnlockedAccount() {
    const { unlockedAccountMeta, unlock } = useContext(UnlockContext);

    return [unlockedAccountMeta, unlock] as const;
}
