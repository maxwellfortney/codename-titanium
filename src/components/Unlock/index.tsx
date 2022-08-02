import { useEffect, useState } from "react";
import { useUnlockedAccount } from "../../hooks/useUnlockedAccount";
import Loader from "../Common/Loader";

export default function UnlockComponent() {
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [unlockedAccountMeta, unlock] = useUnlockedAccount();

    const [passwordInput, setPasswordInput] = useState("");

    async function handleAttemptUnlock() {
        setLoading(true);
        try {
            await unlock(passwordInput);
        } catch (e) {
            console.log(e);
            setShowError(true);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (showError) {
            setTimeout(() => {
                setShowError(false);
            }, 300);
        }
    }, [showError]);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <div className="flex flex-col items-center justify-center flex-1 w-full gap-y-2">
                <input
                    type="password"
                    value={passwordInput}
                    placeholder="Enter password"
                    onChange={(e) => [setPasswordInput(e.target.value)]}
                    className={`w-full px-4 py-2 rounded-full outline-none transition-all duration-150 bg-secondary ${
                        showError ? "animate-shake bg-[#5f3036]" : ""
                    }`}
                />
                <button
                    onClick={handleAttemptUnlock}
                    disabled={passwordInput.length === 0 || loading}
                    className="flex items-center justify-center h-[40px] w-full py-2 font-medium text-black transition-opacity duration-200 bg-white rounded-full hover:opacity-80 disabled:opacity-50"
                >
                    {loading ? <Loader /> : <p>Unlock</p>}
                </button>
            </div>
        </div>
    );
}
