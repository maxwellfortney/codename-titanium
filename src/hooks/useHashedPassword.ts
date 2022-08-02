import { useLocalStorage } from "usehooks-ts";
import { PROJECT_CODENAME } from "../config";

const HASHED_PASSWORD_KEY = PROJECT_CODENAME + "__hashedPassword";

export default function useHashedPassword() {
    const [hashedPassword, setHashedPassword] = useLocalStorage<string | undefined>(HASHED_PASSWORD_KEY, undefined);

    return [hashedPassword, setHashedPassword] as const;
}
