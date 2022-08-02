import { validateMnemonic } from "bip39";
import { useState } from "react";
import useAccountMetas from "../../../hooks/useAccountMetas";

export default function RecoveryPhrasePage() {
    const { createHDBaseAccountMeta } = useAccountMetas();
    const [mnemonicInput, setMnemonicInput] = useState("");

    const mnemonicValid = validateMnemonic(mnemonicInput);

    async function handleImport() {
        await createHDBaseAccountMeta({ mnemonic: mnemonicInput });
    }

    return (
        <div className="flex flex-col items-center justify-start w-full h-full p-4">
            <h1 className="self-start text-xl font-semibold">Import Recovery Phrase</h1>
            <p className="self-start mt-1 text-sm text-secondary-text">
                To import a new wallet, enter its recovery phrase below. It will be encrypted and stored securely on
                your device.
            </p>

            <div className="flex flex-col items-center justify-between flex-1 w-full">
                <textarea
                    value={mnemonicInput}
                    onChange={(e) => [setMnemonicInput(e.target.value)]}
                    className="w-full bg-secondary rounded-lg min-h-[150px] p-3 outline-none mt-6"
                    placeholder="Enter recovery phrase"
                />

                <button
                    onClick={handleImport}
                    disabled={!mnemonicValid}
                    className="flex items-center justify-center w-full py-2 font-medium text-black transition-opacity duration-200 bg-white rounded-full hover:opacity-80 disabled:opacity-50"
                >
                    <p>Import</p>
                </button>
            </div>
        </div>
    );
}
