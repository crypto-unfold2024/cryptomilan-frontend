'use client'
import { Button } from '@/components/ui/button';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

const client = new SuiClient({ url: getFullnodeUrl('devnet') });

const walletAddress = '0x3af3fd05d135413e03ddc942ee8e4042f4eb624e8858d3fe4e0e7e5f117b66b3'
const treasuryCapObjectId = "ELPtL7R97taJi83m5MuNkbLuVdDCydku8SbjCwrnoh8B"; // Replace with the actual TreasuryCap object ID

const AdminPage = () => {
    const tx = new Transaction();

    const execute = async () => {
        const exampleMnemonic = 'bomb code roast cross trust proud size song render spirit travel fitness';
        const keypair = Ed25519Keypair.deriveKeypair(exampleMnemonic);
        const sender = keypair.getPublicKey().toSuiAddress()
        tx.setSender(sender);
        await tx.sign({ client, signer: keypair });
        tx.moveCall({
            target: '0x7ae500436282efcc230f679b813f5f2f6c82f42bbf813cbc7ea63a97f2b67e85::loyalty::reward_user',
            arguments: [tx.object("0xdcdc410672bf32087afcfe8ceaf2309ee7eaac5d0ce98a5a22dbdc9d189a66a9"), tx.pure.u64(2), tx.pure.address(walletAddress)],
        });
        const result = await client.signAndExecuteTransaction({
            transaction: tx,
            signer: keypair,
            requestType: 'WaitForLocalExecution',
            options: {
                showEffects: true,
            },
        });
        await client.waitForTransaction({ digest: result.digest });
    }
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <Button onClick={execute}>Execute Transaction</Button>
        </div>
    )
}

export default AdminPage