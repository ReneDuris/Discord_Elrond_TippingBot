import { SlashCommandBuilder } from "@discordjs/builders";
import { readFileSync} from "fs";

import path from "path";
export default  {
    data: new SlashCommandBuilder()
        .setName('table')
        .setDescription('Table of users'),
            
            async execute(interaction) {
              try{
                const configDirectory = path.resolve(process.cwd(), "essentials");
                let tableSend =  JSON.parse(readFileSync(path.join(configDirectory, '../essentials/tableSend.json')));
                
                var cart = [];
               let field = tableSend.map(item => {
                    var element = {};
                    const username = item.username;
                    const funds = item.funds;
                    var value = 0;
                    var tokens = funds.map(some => {
                        value +=some.amount
                        return {
                            [some.token] : some.amount
                                  }
                    })
                    var string = JSON.stringify(tokens).replace(/[&\/\\#+()$~%:'"*?<>{}]/g, ' ').replace(/,/g, '\n').slice(1).slice(0, - 1)
                    const result = username + ":" + "\n" + string + "\n";
                    element.name = result;
                    element.value = value;
                    
                    cart.push(element);
                    return cart
                })
               let ranks = field[0].sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
                      
const exampleEmbed = {
	color: 0x0099ff,
	fields: ranks,
	timestamp: new Date().toISOString(),
	footer: {
		text: 'Thanks for being here today!',
	},
};
            await interaction.reply({ embeds: [exampleEmbed] });
}catch{
    await interaction.reply("Table is empty");               
} 
            }   
                           
        }