import { useLocalStorage } from "usehooks-ts";
import { PROJECT_CODENAME } from "../config";

const ACTIVE_ACCOUNT_INDEX_KEY = PROJECT_CODENAME + "__selectedAccountIndex";

export default function useActiveAccountIndex() {
    const [activeAccountIndex, setActiveAccountIndex] = useLocalStorage(ACTIVE_ACCOUNT_INDEX_KEY, 0);

    return {
        activeAccountIndex,
        setActiveAccountIndex,
    };
}
