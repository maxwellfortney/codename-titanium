import { clusterApiUrl } from "@solana/web3.js";

export enum ClusterSlug {
    MAINNET = "mainnet-beta",
    DEVNET = "devnet",
    TESTNET = "testnet",
    LOCALNET = "localnet",
}

export interface Cluster {
    endpoint: string;
    label: string;
    slug: ClusterSlug;
}

export const clustersMap = new Map<ClusterSlug, Cluster>([
    [
        ClusterSlug.MAINNET,
        {
            endpoint:
                "https://nameless-sparkling-pine.solana-mainnet.quiknode.pro/959ee31f9990e3ed0021aeae74e23bff6e35cc2d/",
            label: "Mainnet",
            slug: ClusterSlug.MAINNET,
        },
    ],
    [
        ClusterSlug.DEVNET,
        {
            endpoint: clusterApiUrl(ClusterSlug.DEVNET),
            label: "Devnet",
            slug: ClusterSlug.DEVNET,
        },
    ],
    [
        ClusterSlug.TESTNET,
        {
            endpoint: clusterApiUrl(ClusterSlug.DEVNET),
            label: "Testnet",
            slug: ClusterSlug.DEVNET,
        },
    ],
    [
        ClusterSlug.LOCALNET,
        {
            endpoint: "http://localhost:8899",
            label: "Localhost",
            slug: ClusterSlug.LOCALNET,
        },
    ],
]);

export const clustersArr = [
    {
        endpoint:
            "https://nameless-sparkling-pine.solana-mainnet.quiknode.pro/959ee31f9990e3ed0021aeae74e23bff6e35cc2d/",
        label: "Mainnet",
        slug: ClusterSlug.MAINNET,
    },
    {
        endpoint: clusterApiUrl(ClusterSlug.DEVNET),
        label: "Devnet",
        slug: ClusterSlug.DEVNET,
    },
    {
        endpoint: clusterApiUrl(ClusterSlug.TESTNET),
        label: "Testnet",
        slug: ClusterSlug.TESTNET,
    },
    {
        endpoint: "http://localhost:8899",
        label: "Localhost",
        slug: ClusterSlug.LOCALNET,
    },
];

export default class ClusterAdapter {
    static clusterForSlug(slug: ClusterSlug) {
        return clustersArr.find((cluster) => cluster.slug === slug)!;
    }
}
