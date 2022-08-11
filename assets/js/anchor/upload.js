import {encrypt} from "../lit/encrypt";
import {shdw} from "../shdw";
import {textEncoder} from "./util";
import {web3} from "@project-serum/anchor";

export async function upload(program, provider, json) {
    try {
        // get user wallet
        const publicKey = provider.wallet.publicKey.toString();
        // parse uploader
        const parsed = JSON.parse(json);
        // validate uploader
        const uploader = new web3.PublicKey(parsed.uploader);
        if (publicKey !== uploader.toString()) {
            const msg = "current wallet does not match requested uploader address";
            console.log(msg);
            app.ports.genericError.send(msg);
            return null
        }
        // build mint
        const mint = new web3.PublicKey(parsed.mint);
        // // select files
        const files = document.getElementById("gg-sd-zip").files;
        // invoke encryption
        const encrypted = await encrypt(mint, files);
        // upload blob to shdw drive
        const fileName = "encrypted.zip"
        const file = new File([encrypted.encryptedZip], fileName)
        const url = await shdw(provider.wallet, file);
        // derive pda increment
        let pdaIncrement, _;
        [pdaIncrement, _] = await web3.PublicKey.findProgramAddress(
            [
                mint.toBuffer(),
                provider.wallet.publicKey.toBuffer(),
            ],
            program.programId
        );
        // derive pda datum
        let pdaDatum;
        [pdaDatum, _] = await web3.PublicKey.findProgramAddress(
            [
                mint.toBuffer(),
                provider.wallet.publicKey.toBuffer(),
                Buffer.from([parsed.increment])
            ],
            program.programId
        );
        // build upload url
        const prefix = url.replace(fileName, "");
        const encodedPrefix = textEncoder.encode(prefix);
        // invoke rpc
        await program.methods
            .publishAssets(parsed.increment, Buffer.from(encrypted.encryptedSymmetricKey), Buffer.from(encodedPrefix))
            .accounts({
                datum: pdaDatum,
                increment: pdaIncrement,
                mint: mint,
                payer: provider.wallet.publicKey,
                systemProgram: web3.SystemProgram.programId
            })
            .rpc();
        // report to elm
        app.ports.uploadSuccess.send(json);
        console.log("publish assets success");
        // or catch error
    } catch (error) {
        console.log(error)
        app.ports.genericError.send(error.toString());
    }
}
