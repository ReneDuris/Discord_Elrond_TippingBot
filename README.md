# Discord_Elrond_TippingBot
Admins can tip to their community with EGLD/ESDT/NFT.


# STEP1  [Configuring BOT]
As first you need to configure your .env file with these informations!

![env](https://github.com/ReneDuris/Discord_Elrond_TippingBot/blob/main/png/.env.png?raw=true ".env FILE")
#### TOKEN_ID - [DISCORD APPLICATIONS](https://discord.com/developers/applications)
- example
```
OTU5MDk3Mjc3MDI3MzUyNjE4.G5sCgl.ziC3-NBtDDJ1VKixbq4cdlyORKMSVJImi4VcC0
```

#### CLIENT_ID - [DISCORD APPLICATIONS](https://discord.com/developers/applications)
- example
```
959097277027352618
```
#### GUILD_ID - [DISCORD SERVER](https://discord.com/)
- example
```
963086560851533824
```

# STEP2  [SETTING YOUR TOKENS]
[EGLD/ESDT](https://github.com/ReneDuris/Discord_Elrond_TippingBot/blob/main/src/commands/sendTip.js#L14)
- display name of your TOKEN
- ticker of your TOKEN
```
.addChoices({name:'AERO',value:'AERO-458bbf'}, {name:'KVRI',value:'KVRI-743439'}))

```
[NFT](https://github.com/ReneDuris/Discord_Elrond_TippingBot/blob/main/src/commands/sendNFT.js#L14)
- display name of your NFT
- ticker of your NFT
```
.addChoices({name:'DOPE EAGLE',value:'DOPE-cc0890'},{name:'AVIATOR',value:'AVIA-efb152'},{name:'KAVARIIAN',value:'KVRIAN-436761'}))

```
# STEP3 [INVITING BOT TO DISCORD SERVER]
#### INVITE LINK - [DISCORD APPLICATIONS](https://discord.com/developers/applications)
----------------------- ------------------------------------
*THESE SCOPES NEEDS TO BE ALLOWED UPON CREATING INVITELINK FOR BOT!*
- [x] **bot**
- [x] **application.commands**

----------------------------------------------------------------
 
# FINAL STEPS  [COMMANDS]
<!-- COMMANDS -->
#### ONLY ADMINS
- [x] **/generate** [Generate Pem Wallet](https://github.com/ReneDuris/Discord_Elrond_TippingBot/blob/main/png/generate_pem.png)
----------------------- ------------------------------------
*WALLET HAS TO BE GENERATED FIRST BEFORE ANYTHING ELSE IS MADE.*

*WALLET CAN BE SET JUST ONCE*

*AFTER WALLET IS GENERATED YOU ARE ABLE SEND FUNDS TO THE NEW GENERATED WALLET*

----------------------------------------------------------------
- [x] /**sendesdt** [Send EGLD/ESDT](https://github.com/ReneDuris/Discord_Elrond_TippingBot/blob/main/png/send_esdt.png)
----------------------- ------------------------------------
*SEND ANY ALLOWED TOKENS TO ANY USERS WHO GOT REGISTERED.*

----------------------------------------------------------------
- [x] **/sendnft** [Send NFT](https://github.com/ReneDuris/Discord_Elrond_TippingBot/blob/main/png/send_nft.png)
----------------------- ------------------------------------
*SEND ANY ALLOWED NFTs TO ANY USERS WHO GOT REGISTERED.*

----------------------------------------------------------------
#### COMMUNITY
- [x] **/register** [Register your wallet](https://github.com/ReneDuris/Discord_Elrond_TippingBot/blob/main/png/register.png)
----------------------- ------------------------------------
*USER CAN REGISTER BY SPECIFYING THEIR BECH32 WALLET.*

----------------------------------------------------------------
- [x] **/table** [Top tipped users](https://github.com/ReneDuris/Discord_Elrond_TippingBot/blob/main/png/table.png)
----------------------- ------------------------------------
*TABLE OF TOP REWARDED PEOPLE AND COUNT OF THEIR TOKENS.*

----------------------------------------------------------------

