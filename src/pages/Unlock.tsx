import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/Common/Loader";
import useHashedPassword from "../hooks/useHashedPassword";
import { useUnlockedAccount } from "../hooks/useUnlockedAccount";

export default function UnlockPage() {
    const [hashedPassword, setHashedPassword] = useHashedPassword();
    const [unlockedAccountMeta, unlock] = useUnlockedAccount();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const callbackUrl = searchParams.get("callbackUrl");

    async function attemptUnlock() {
        const _unlockedAccountMeta = await unlock();

        if (_unlockedAccountMeta) {
            navigate(callbackUrl || "/wallet/coins");
        }
    }

    useEffect(() => {
        if (hashedPassword) {
            attemptUnlock();
        }
    }, [hashedPassword]);

    if (hashedPassword) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <Loader color="border-white" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start w-full h-full">
            <Outlet />
        </div>
    );
}
