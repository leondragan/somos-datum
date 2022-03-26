import {web3, BN} from "@project-serum/anchor";
import {ACCOUNT_SEED} from "./config";

export async function init(program, provider, ledger, user, n, price, resale) {
    try {
        const priceInLamports = price * web3.LAMPORTS_PER_SOL
        await program.rpc.initializeLedger(ACCOUNT_SEED, new BN(n), new BN(priceInLamports), resale, {
            accounts: {
                user: provider.wallet.publicKey,
                ledger: ledger,
                systemProgram: web3.SystemProgram.programId,
            },
        });
        // send state to elm
        app.ports.getCurrentStateListener.send(user);
        // log success
        console.log("program init success");
    } catch (error) {
        // log error
        console.log(error.toString());
        // send error to elm
        app.ports.initProgramFailureListener.send(error.message)
    }
}
