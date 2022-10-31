import { SlashCommandBuilder } from "@discordjs/builders";
import { GenerateTransaction } from "../essentials/sendTransaction.js";
import { readFileSync,writeFileSync } from "fs";
import{verifyEGLD,verifyESDT} from "../essentials/validation.js"
import path from "path";
export default  {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions('0')
        .setName('sendesdt')
        .setDescription('Send ESDT or EGLD')
        .addStringOption(option => option.setName('token')
            .setDescription('Select Token you would like to send')
            .setRequired(true)
            .addChoices({name:'AERO',value:'AERO-458bbf'}, {name:'KVRI',value:'KVRI-743439'}))
        .addNumberOption(option => option.setName('amount')
            .setDescription('Input amount you would like to send')
            .setRequired(true))
        .addUserOption(option => option.setName('user')
        .setDescription('To whom send transaction?')
            .setRequired(true)),
            async execute(interaction) {
                await interaction.reply({ content: 'processing....', ephemeral: true });
               
                const token = interaction.options.getString('token');
                const value = interaction.options.getNumber("amount");
                const receiver = interaction.options.getUser("user").id;
                const username = interaction.options.getUser("user").username;
                    if (token == "EGLD"){
                        var state = await verifyEGLD(value);
                        var amount = value
                        var real_amount = value;
                    }else{
                        let res = await verifyESDT(token,value);
                        var state = res.state;
                        var real_amount = res.realValue;
                        var amount = value;
                    }
                if (state == true) {
                const configDirectory = path.resolve(process.cwd(), "essentials");
                let myObject =  JSON.parse(readFileSync(path.join(configDirectory, '../essentials/userWallets.json')));
                const exist = myObject.some(item => item.user_id == receiver );
                if (exist){
                    let data = myObject.find(item => item.user_id == receiver);
                    const address = data['bech32'];

                    const result = await GenerateTransaction(address,real_amount,token,"ESDT");
                    if (result.status == "success") {
                        var emoji = "✅";
                        let tableSend =  JSON.parse(readFileSync(path.join(configDirectory, '../essentials/tableSend.json')));
                        const exist = tableSend.find(item => item.id == receiver);
                        
                        if (exist) {
                            const entry =exist.funds;
                            const entry_exist = entry.find(item => item.token == token);
                         
                            if (entry_exist){
                                entry_exist.amount += amount;
                                    
                            }
                            else{
                                exist.funds.push({
                                token: token,
                                amount: amount
                                });
                            }
                        } else {
                            const values = {
                                username: username,
                                id: receiver,
                                funds: [{
                                token: token,
                                amount: amount
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
                await interaction.followUp({ content: "Not Enough Balance of EGLD or ESDT", ephemeral: true });
            }
            }                  
}