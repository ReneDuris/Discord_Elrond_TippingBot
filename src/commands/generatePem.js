import { SlashCommandBuilder } from "@discordjs/builders";
import {existsSync} from "fs";
import {GeneratePem} from "../essentials/generateWallet.js"
import path from "path";
export default  {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions('0')
        .setName('generate')
        .setDescription('Generate your wallet'),
            
            async execute(interaction) {
                const configDirectory = path.resolve(process.cwd(), "src");
                const exist = existsSync(path.join(configDirectory,"../wallet.pem"));
              
                if(!exist){
                let address = GeneratePem();
                await interaction.reply({ content: address, ephemeral: true });
                }
                else{
                    await interaction.reply({ content: "Wallet Already generated", ephemeral: true });
                }
        }
    }