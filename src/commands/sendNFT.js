import { SlashCommandBuilder } from "@discordjs/builders";
import { GenerateTransaction } from "../essentials/sendTransaction.js";
import { readFileSync,writeFileSync } from "fs";
import{verifyNFT} from "../essentials/validation.js"
import path from "path";
export default  {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions('0')
        .setName('sendnft')
        .setDescription('Send NFT')
        .addStringOption(option => option.setName('NFT')
            .setDescription('Select NFT you would like to send')
            .setRequired(true)
            .addChoices({name:'DOPE EAGLE',value:'DOPE-cc0890'},{name:'AVIATOR',value:'AVIA-efb152'},{name:'KAVARIIAN',value:'KVRIAN-436761'}))
        .addStringOption(option => option.setName('nonce')
            .setDescription('Input nonce of NFT you would like to send')
            .setRequired(true))
        .addUserOption(option => option.setName('user')
        .setDescription('To whom send transaction?')
            .setRequired(true)),
            async execute(interaction) {
                await interaction.reply({ content: 'processing....', ephemeral: true });
               
                const token = interaction.options.getString('token');
                const nonce = interaction.options.getString("nonce");
                const receiver = interaction.options.getUser("user").id;
                const username = interaction.options.getUser("user").username;
 
                var state = await verifyNFT(token,nonce);
                if (state == true) {
                    const configDirectory = path.resolve(process.cwd(), "essentials");
                    let myObject =  JSON.parse(readFileSync(path.join(configDirectory, '../essentials/userWallets.json')));
                    const exist = myObject.some(item => item.user_id == receiver );
                if (exist){
                    let data = myObject.find(item => item.user_id == receiver);
                    const address = data['hex'];
                    const result = await GenerateTransaction(address,nonce,token, "NFT");
                    if (result.status == "success") {
                        var emoji = "✅";
                        let tableSend =  JSON.parse(readFileSync(path.join(configDirectory, '../essentials/tableSend.json')));
                        const exist = tableSend.find(item => item.id == receiver);
                        
                        if (exist) {
                            const entry =exist.funds;
                            const entry_exist = entry.find(item => item.token == token);
                         
                            if (entry_exist){
                                entry_exist.amount += 1;      
                            }
                            else{
                                exist.funds.push({
                                token: token,
                                amount: 1
                                });
                            }
                        } else {
                            const values = {
                                username: username,
                                id: receiver,
                                funds: [{
                                token: token,
                                amount: 1
                                }]
                            }
                            tableSend.push(values);
                            }
                            let newData = JSON.stringify(tableSend);
                            writeFileSync(path.join(configDirectory, '../essentials/tableSend.json'), newData);
                    }else{
                        var emoji = "❌";
                    }
                    const msg = result.status+ emoji+'\n'+'\n'+"<https://explorer.elrond.com/"+ result.hash.toString('hex') + ">";

                    await interaction.followUp({ content: msg, ephemeral: true });

                }else{
                    await interaction.followUp({ content: "User is not Registered", ephemeral: true });
                }
            }else{
                await interaction.followUp({ content: "Not Enough Balance of EGLD or NFT", ephemeral: true });
            }
            }                  
}