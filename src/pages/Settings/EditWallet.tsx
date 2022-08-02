import { useState } from "react";
import useAccountMetas from "../../hooks/useAccountMetas";
import useActiveAccountIndex from "../../hooks/useActiveAccountIndex";

export default function EditWalletPage() {
    const [nameInput, setNameInput] = useState("");

    async function handleUpdateName() {
        // updateName(nameInput);
        setNameInput("");
    }

    return (
        <div className="flex flex-col items-center justify-start w-full h-full p-4">
            <h1 className="self-start text-xl font-semibold">Edit Wallet</h1>

            <div className="flex flex-col justify-between w-full h-full mt-6">
                <input
                    type="text"
                    // placeholder={activeAccount.name}
                    value={nameInput}
                    onChange={(e) => {
                        setNameInput(e.target.value);
                    }}
                    className="w-full px-4 py-2 rounded-lg outline-none bg-secondary"
                />

                <button
                    onClick={handleUpdateName}
                    disabled={nameInput.length === 0}
                    className="flex items-center justify-center w-full py-2 font-medium text-black transition-opacity duration-200 bg-white rounded-full hover:opacity-80 disabled:opacity-50"
                >
                    <p>Save Changes</p>
                </button>
            </div>
        </div>
    );
}
