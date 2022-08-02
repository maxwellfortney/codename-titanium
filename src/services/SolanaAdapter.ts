import { Connection, PublicKey, TokenAmount } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

export default class SolanaAdapter {
    static async getTokenAccountsByOwner(connection: Connection, owner: PublicKey) {
        let accounts = await connection.getParsedTokenAccountsByOwner(owner, {
            programId: TOKEN_PROGRAM_ID,
        });

        accounts.value = accounts.value.filter((account) => {
            return account.account.data.parsed["info"]["tokenAmount"]["uiAmount"] > 0;
        });

        return accounts.value.map((accountCtx) => {
            const tokenAmount = accountCtx.account.data.parsed["info"]["tokenAmount"] as TokenAmount;

            return {
                address: accountCtx.pubkey,
                mint: new PublicKey(accountCtx.account.data.parsed["info"]["mint"]),
                tokenAmount,
            };
        });
    }

    static async getParsedMetadata(connection: Connection, metadataAddress: PublicKey) {
        const accountInfo = await connection.getAccountInfo(metadataAddress);

        if (!accountInfo?.data) {
            return undefined;
        }

        const metadata = Metadata.fromAccountInfo(accountInfo)[0];

        if (metadata) {
            metadata.data.name = metadata.data.name.replace(/[^\x00-\x7F]/g, "").replace(/\0/g, "");
            metadata.data.symbol = metadata.data.symbol.replace(/[^\x00-\x7F]/g, "").replace(/\0/g, "");
            metadata.data.uri = metadata.data.uri.replace(/[^\x00-\x7F]/g, "").replace(/\0/g, "");
        }

        return metadata;
    }

    static async getParsedMetadataForMint(connection: Connection, mint: PublicKey) {
        const metadataAddress = await this.getMetadataPDA(mint);

        return await this.getParsedMetadata(connection, metadataAddress);
    }

    static async getMetadataPDA(mint: PublicKey) {
        return (
            await PublicKey.findProgramAddress(
                [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
                TOKEN_METADATA_PROGRAM_ID
            )
        )[0];
    }
}
