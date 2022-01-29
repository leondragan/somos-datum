import {web3} from "@project-serum/anchor";
import {getCurrentState} from "../state";
import {BOSS} from "../config";

export async function primary(program, provider, statePublicKey, user) {
    try {
        await program.rpc.purchasePrimary({
            accounts: {
                user: provider.wallet.publicKey,
                boss: BOSS,
                ledger: statePublicKey,
                systemProgram: web3.SystemProgram.programId,
            },
        });
        // get state after transaction
        await getCurrentState(program, statePublicKey, user);
        // sign message
        // const signedMessage = "todo sign message for http client download"
        // app.ports.downloadRequestListener.send(signedMessage);
        // log success
        console.log("primary purchase success & download request sent to elm");
    } catch (error) {
        // log error
        console.log(error.toString());
        // send error to elm
        app.ports.purchasePrimaryFailureListener.send(error.message)
    }
}
