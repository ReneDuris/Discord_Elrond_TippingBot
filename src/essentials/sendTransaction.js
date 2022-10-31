import { readFileSync } from "fs";
import { UserSigner } from "@elrondnetwork/erdjs-walletcore/out/userSigner.js";
import { UserSecretKey } from "@elrondnetwork/erdjs-walletcore/out/userKeys.js";
import { Transaction, TransactionPayload, Address, TokenPayment, Account } from "@elrondnetwork/erdjs";
import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers";
import { TransactionWatcher } from "@elrondnetwork/erdjs/out/transactionWatcher.js";
import{numberToPaddedHex} from "@elrondnetwork/erdjs/out/utils.codec.js"
import path from "path";


export async function GenerateTransaction(address,amount,token, ESDTNFT){ 
    const proxy = new ProxyNetworkProvider("https://gateway.elrond.com",{ timeout: 30000 });
    const configDirectory = path.resolve(process.cwd(), "src");
    const pem = readFileSync(path.join(configDirectory,"../wallet.pem")).toString('utf8');
    const secretKey = UserSecretKey.fromPem(pem, 0);
    let OnNetwork = await proxy.getAccount(secretKey.generatePublicKey().toAddress());
    const account = new Account(secretKey.generatePublicKey().toAddress());

    if(token == "EGLD"){
        var value = amount;
        var data = "";
        var gas = 50000;
        var receiver = address;
    }else{
        if (ESDTNFT == "ESDT"){
            var value = 0;
            var data = "ESDTTransfer@"+Buffer.from(token, 'utf8').toString('hex')+"@"+numberToPaddedHex(amount);
            var gas = 350000
            var receiver = address;
        }else{
            var value = 0;
            var data = "ESDTNFTTransfer@"+Buffer.from(token, 'utf8').toString('hex')+"@"+amount +"@01"+"@"+address;
            var gas = 438250
            var receiver =account.address.bech32();
        }
        
    }
    account.update(OnNetwork);
    const signer = new UserSigner(secretKey);
    const transaction = new Transaction({
        data: new TransactionPayload(data),
        gasLimit: gas,
        receiver: new Address(receiver),
        value: TokenPayment.egldFromAmount(value),
        chainID: "D"
    });
    transaction.setNonce(account.getNonceThenIncrement());
    signer.sign(transaction);
    await proxy.sendTransaction(transaction);

    const watcher = new TransactionWatcher(proxy);
    const transactionOnNetwork = await watcher.awaitCompleted(transaction);

    const result = {
        status: transactionOnNetwork.status.status,
        hash: transaction.getHash().hash
    }
    return result
}
