import { Keypair } from "@solana/web3.js";
import base58 from "bs58";
import { useMemo, useState } from "react";
import useAccountMetas from "../../../hooks/useAccountMetas";

function getKeypairForInput(input: string): Keypair {
    input = input.replace(new RegExp(/[\[\]]|\s+/g), "");

    if (input.includes(",")) {
        const intArr = input
            .split(",")
            .map((x) => parseInt(x))
            .slice(0, 32);

        return Keypair.fromSeed(Uint8Array.from(intArr));
    }

    return Keypair.fromSecretKey(base58.decode(input));
}

export default function PrivateKeyPage() {
    const { createPrivateKeyAccountMeta } = useAccountMetas();
    const [privateKeyInput, setPrivateKeyinput] = useState("");

    const derivedKeypair = useMemo(() => {
        try {
            return getKeypairForInput(privateKeyInput);
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }, [privateKeyInput]);

    async function handleImport() {
        if (derivedKeypair === undefined) {
            throw new Error("No derived keypair found");
        }

        console.log(base58.encode(derivedKeypair.secretKey));

        await createPrivateKeyAccountMeta({ privateKey: base58.encode(derivedKeypair.secretKey) });
    }

    return (
        <div className="flex flex-col items-center justify-start w-full h-full p-4">
            <h1 className="self-start text-xl font-semibold">Import Private Key</h1>
            <p className="self-start mt-1 text-sm text-secondary-text">
                To import a new wallet, enter its recovery phrase below. It will be encrypted and stored securely on
                your device.
            </p>

            <div className="flex flex-col items-center justify-between flex-1 w-full">
                <textarea
                    value={privateKeyInput}
                    onChange={(e) => {
                        setPrivateKeyinput(e.target.value);
                    }}
                    className="w-full bg-secondary rounded-lg min-h-[150px] p-3 outline-none mt-6"
                    placeholder="Enter private key"
                />

                <button
                    onClick={handleImport}
                    disabled={derivedKeypair === undefined}
                    className="flex items-center justify-center w-full py-2 font-medium text-black transition-opacity duration-200 bg-white rounded-full hover:opacity-80 disabled:opacity-50"
                >
                    <p>Import</p>
                </button>
            </div>
        </div>
    );
}
