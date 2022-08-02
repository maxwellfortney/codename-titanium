import { useLocalStorage } from "usehooks-ts";
import { PROJECT_CODENAME } from "../config";
import ClusterAdapter, { Cluster, ClusterSlug } from "../services/ClusterAdapter";

const SELECTED_CLUSTER_KEY = PROJECT_CODENAME + "__selectedCluster";

export default function useSelectedCluster() {
    const [selectedCluster, setSelectedCluster] = useLocalStorage<Cluster>(
        SELECTED_CLUSTER_KEY,
        ClusterAdapter.clusterForSlug(ClusterSlug.MAINNET)
    );

    return [selectedCluster, setSelectedCluster] as const;
}
