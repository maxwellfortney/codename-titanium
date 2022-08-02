import useSelectedCluster from "../../hooks/useSelectedCluster";
import { Cluster, clustersArr } from "../../services/ClusterAdapter";

export default function NetworkPage() {
    return (
        <div className="flex flex-col items-center justify-start w-full p-4">
            <h1 className="self-start text-xl font-semibold">Choose Network</h1>

            <div className="flex flex-col items-center justify-start w-full mt-6 gap-y-2">
                {clustersArr.map((cluster) => {
                    return <ClusterSelectItem key={cluster.slug} cluster={cluster} />;
                })}
            </div>
        </div>
    );
}

function ClusterSelectItem({ cluster }: { cluster: Cluster }) {
    const [selectedCluster, setSelectedCluster] = useSelectedCluster();

    const isActive = selectedCluster.slug === cluster.slug;

    function handleClick() {
        setSelectedCluster(cluster);
    }

    return (
        <button
            disabled={isActive}
            onClick={handleClick}
            className={`flex flex-col transition-all duration-200 bg-opacity-100 items-start justify-start w-full rounded-lg p-3 ${
                isActive ? "bg-secondary" : "hover:bg-secondary hover:bg-opacity-30"
            }`}
        >
            <h2 className="font-medium">{cluster.label}</h2>
            <p className="mt-1 text-sm text-left break-all text-secondary-text">{cluster.endpoint}</p>
        </button>
    );
}
