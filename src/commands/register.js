import { SlashCommandBuilder } from "@discordjs/builders";
import { readFileSync,writeFileSync } from "fs";
import { Address } from "@elrondnetwork/erdjs/out/address.js";
import path from "path";
export default  {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register your wallet')
        .addStringOption(option => option.setName('wallet')
            .setDescription('Input your wallet address (erd1...)')
            .setRequired(true)),
            
            async execute(interaction) {
                const wallet = interaction.options.getString('wallet');
                const user = interaction.user.id;
                try{
                let address = new Address(wallet);
                let data = {
                    'hex': address.valueHex,
                    'bech32' : address.bech32(),
                    'user_id' : user
                }
                const configDirectory = path.resolve(process.cwd(), "essentials");
                let myObject =  JSON.parse(readFileSync(path.join(configDirectory, '../essentials/userWallets.json')));
                const exist = myObject.some(item => item.user_id == user );
                if (exist){
                    await interaction.reply({ content: "Already Registered", ephemeral: true });
                }
                else{
                    
                    myObject.push(data);
                    let newData = JSON.stringify(myObject);
                    writeFileSync(path.join(configDirectory, '../essentials/userWallets.json'),newData); 
                    await interaction.reply({ content: "Your address is now in register", ephemeral: true });
                }
                }
                catch(err){
                    await interaction.reply({ content: "Wrong Address format", ephemeral: true });
                    console.log(err)
                }
                
            }                   
        }