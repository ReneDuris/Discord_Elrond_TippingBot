import { readFileSync } from "fs";
import { UserSecretKey } from "@elrondnetwork/erdjs-walletcore/out/userKeys.js";
import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers";
import path from "path";
const proxy = new ProxyNetworkProvider("https://gateway.elrond.com",{ timeout: 30000 });


export async function verifyEGLD(amount){
    try{
        const configDirectory = path.resolve(process.cwd(), "src");
        const pem = readFileSync(path.join(configDirectory,"../wallet.pem")).toString('utf8');
        const secretKey = UserSecretKey.fromPem(pem, 0);
        const generatedAddress =secretKey.generatePublicKey().toAddress();
    
        let account = await proxy.getAccount(generatedAddress);
        let balance = (account.balance).toNumber();
        let required_balance = amount* 10**18;
        if (required_balance+ 135000000000000 < balance){
            return true
        }
        else{
        return false
    }
    }catch(err){
        console.log(err)
        return false
    }
}
export async function verifyESDT (ticker,amount){
    try{
        const configDirectory = path.resolve(process.cwd(), "src");
        const pem = readFileSync(path.join(configDirectory,"../wallet.pem")).toString('utf8');
        const secretKey = UserSecretKey.fromPem(pem, 0);
        const generatedAddress =secretKey.generatePublicKey().toAddress();
   
        let tokens = await proxy.getFungibleTokenOfAccount(generatedAddress,ticker)
        let properties = await proxy.getDefinitionOfFungibleToken(ticker)
        let egldstate = await verifyEGLD(1 / 10**18)
        const balance = tokens.balance.toNumber();
        const decimals = properties.decimals
        if (amount* 10**decimals <= balance && egldstate == true){
        return {
            state:true,
            realValue: amount* 10**decimals
        };  
    }else{
        return{
            state:false,
            realValue: 0
        };
    }
    }catch(err){
        console.log(err)
        return{
            state:false,
            realValue: 0
        }
    }
}
export async function verifyNFT (ticker,nonce){
    try{
        const configDirectory = path.resolve(process.cwd(), "src");
        const pem = readFileSync(path.join(configDirectory,"../wallet.pem")).toString('utf8');
        const secretKey = UserSecretKey.fromPem(pem, 0);
        const generatedAddress =secretKey.generatePublicKey().toAddress();

        let egldstate = await verifyEGLD(1 / 10**18)
        let tokens = await proxy.getNonFungibleTokenOfAccount(generatedAddress,ticker,nonce);
        let supply = (tokens.supply).toNumber();
      if ( supply > 0 && egldstate == true){
        return true   
    }else{
        return false  
    }
    }catch(err){
        console.log(err)
        return false
    }
}