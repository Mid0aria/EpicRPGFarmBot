dWdnY2Y6Ly9iY3JhLmZjYmd2c2wucGJ6L2dlbnB4LzVwc2tIZ1B4Y3hQVkVlWGxxVVhGb1kgcm90MTM= </br>
6 28 15 26 15<br> {/\_\_/}</br>( • . •)</br>/ > 🤍

<h1 align="center">EpicRPG Farm Bot V0.0.5.4(BETA)</h1>
<p align="center">

[![Total Views](https://hits.sh/github.com/Mid0aria/epicrpgfarmbot.svg?view=today-total&label=Repo%20Today/Total%20Views&color=770ca1&labelColor=007ec6)](https://github.com/Mid0aria/epicrpgfarmbot)
[![Last Commit](https://img.shields.io/github/last-commit/mid0aria/epicrpgfarmbot)](https://github.com/Mid0aria/epicrpgfarmbot)

## Tutorials

### Text

-   [🎈・Installation](#Installation)
    -   [Windows / Linux](#windows--linux) - Official
    -   [Android / iOS (Termux)](#android--ios-termux) - Official

To get auth key, join the Discord server [here](https://discord.gg/WzYXVbXt6C), go to [`#🤖・bot-commands`](https://discord.com/channels/1202294695091507230/1203705738770256032), and send `s!key`. The official bot will directly message you with the key.

</p>

# Contents

[⭐・Star History](#star-history)<br>
[❗・Important](#important)<br>
[👑・Features](#features)<br>
[⚙・Config.json example](#configjson-example)<br>
[💎・Get Token](#get-token)<br>
[📚・Discord RPC](#discord-rpc)<br>
[⚠️・Captcha Alert](#captcha-alert)<br>
[🔗・Required Links](#required-links)<br>
[🎈・Installation](#Installation)<br>

## ⭐・Star History

<h2 align="center">Goal: <a href="https://github.com/Mid0aria/epicrpgfarmbot/stargazers"><img src="https://img.shields.io/github/stars/Mid0aria/epicrpgfarmbot" /></a> / 512</h2>
⭐⭐⭐ You can also give this repository a star so that others know we're trusted!<br>

[![Star History Chart](https://api.star-history.com/svg?repos=Mid0aria/epicrpgfarmbot&type=Date)](https://star-history.com/#Mid0aria/epicrpgfarmbot&Date)

## ❗・Important (Anyone using the bot is deemed to have read and accepted these)

-   Use of this farm bot may lead to actions being taken against your EpicRPG profile and/or your Discord account. We are not responsible for them.
-   Discord may restart as a result of discord RPC overload.
-   DO NOT USE ONE CHANNEL FOR TWO ACCOUNTS, USE IT FOR 1 ACCOUNT ONLY.

## 👑・Features

-   Auto Commands:

    -   Rewards:
        -   Daily
        -   Weekly
        -   Vote (automatically opens the voting site in the browser if you have a vote (not working in termux))
    -   Experience:
        -   Hunt
        -   Adventure
        -   Training
    -   Progress:
        -   Farm
            -   Seed
            -   Potato seed
            -   Carrot seed
            -   Bread seed
        -   Working:
            -   Chop
            -   Fish
            -   Pickup
            -   Mine
            -   Axe
            -   Net
            -   Ladder

-   Event:

    -   Auto Join Events
    -   Auto Special Trade
    -   Auto Accept Arena

-   Inventory:

    -   Auto Check Inventory
    -   Auto Use Life Potion (Heal)
    -   Auto Use Selected LootBoxes
    -   Auto Sell Selected Items

-   Discord RPC
-   Auto Phrases Send
-   Captcha(Ban) Protection v0.0.1 (beta)

-   NEW FEATURES WILL COME WITH UPDATES

## ⚙・config.json example

```
{
    "midoservices_authkey": "mido_services.xxx", / Enter Your midoservices authkey

    "prefix": "e!", / Enter Prefix
    "token": "", / Enter Account Token
    "channelid": "", / Enter channel id where the bot will work
    "userid": "", / Enter your discord account user id
    "commands": {
        "rewards": {
            "daily": true, / true or false
            "weekly": true / true or false
            "vote": {
                "enable": true,
            }
        },
        "experience": {
            "hunt": true, / true or false
            "adventure": true, / true or false
            "training": true / true or false
        },
        "progress": { / !!!! Enable only one of the progress commands, if more than one progress command is enabled, only the farm command is enabled by default
            "farm": {
                "enable": false, / true or false
                "types": {
                    "seed": true, / true or false
                    "potato seed": true, / true or false
                    "carrot seed": true, / true or false
                    "bread seed": true / true or false
                }
            },
            "working": { / !!!! Enable only one of the run commands, if you enable more than one, by default only the chop command will be enabled.
                "chop": false, / true or false
                "fish": true, / true or false
                "pickup": false, / true or false
                "mine": false, / true or false
                "axe": false, / true or false
                "net": false, / true or false
                "ladder": false / true or false
            }
        }
    },
    "settings": {
        "discordrpc": true, / true or false
        "autophrases": true, / true or false
        "event": {
            "autojoin": true, / true or false
            "autospecialtrade": true, / true or false
            "autoarena": true / true or false
        },

        "inventory": {
            "check": true, / true or false
            "lifepotion": {
                "autouse": true, / true or false
                "hplimit": 170 / will automatically use a life potion when your health drops below this value
            },
            "lootbox": {
                "autouse": true, / true or false
                "types": {
                    "common lootbox": true, / true or false
                    "uncommon lootbox": true, / true or false
                    "rare lootbox": true, / true or false
                    "EPIC lootbox": true, / true or false
                    "EDGY lootbox": true, / true or false
                    "OMEGA lootbox": true / true or false
                }
            },
            "sell": {
                "enable": false, / true or false
                "types": {
                    "normie fish": true, / true or false
                    "golden fish": true, / true or false
                    "EPIC fish": true, / true or false
                    "SUPER fish": true, / true or false
                    "wooden log": true, / true or false
                    "EPIC log": true, / true or false
                    "SUPER log": true, / true or false
                    "MEGA log": true, / true or false
                    "HYPER log": true, / true or false
                    "ULTRA log": true, / true or false
                    "ULTIMATE log": true, / true or false
                    "apple": true, / true or false
                    "banana": true, / true or false
                    "bread": true, / true or false
                    "carrot": true, / true or false
                    "flask": true, / true or false
                    "wolf skin": true, / true or false
                    "zombie eye": true / true or false
                }
            }
        }
    }
}

```

## 💎・Get Token

### PC

1. Open your preferred browser (with developer tools) and login to https://discord.com/app
2. Press CTRL + Shift + I and open the Console tab.
3. Paste the following code.
4. The text returned (excluding the quotes `'`) will be your Discord account token.

```js
(webpackChunkdiscord_app.push([
    [""],
    {},
    (e) => {
        for (let t in ((m = []), e.c)) m.push(e.c[t]);
    },
]),
m)
    .find((e) => e?.exports?.default?.getToken !== void 0)
    .exports.default.getToken();
```

### Mobile/Android

1. Open Chrome
2. Create a bookmark (by clicking on star button in 3 dots menu)
3. Edit it and set name to Token Finder and url to the following code:
    ```javascript
    javascript: (webpackChunkdiscord_app.push([[""],{},(e)=>{m=[];for (let c in e.c) m.push(e.c[c]);},]),m).find((m) => m?.exports?.default?.getToken%20!==%20void%200)%20%20%20%20.exports.default.getToken();
    ```
4. Open https://discord.com/app and log in.
5. Tap on search bar and type Token Finder (don't search it just type)
6. Click on the bookmark named Token Finder.
7. A new page will open, the text in the page will be your Discord account token.

## 📚・Discord RPC

![](https://raw.githubusercontent.com/Mid0aria/epicrpgfarmbot/main/images/rpc.jpg)

## ⚠️・Captcha Alert

> [!NOTE]
> If you want the captcha alert to work properly, turn off do not disturb

![](https://raw.githubusercontent.com/Mid0aria/epicrpgfarmbot/main/images/captchaalert.png)

## 🔗・Required Links

[NodeJS](https://nodejs.org/en/)<br>
[Terminal](https://apps.microsoft.com/detail/9n0dx20hk701)<br>
[Farm Bot ZIP File](https://github.com/Mid0aria/epicrpgfarmbot/archive/refs/heads/main.zip)

## 🎈・Installation

### 🖥️・Windows / Linux

```bash
# Check Node.js version:
node -v

# Clone the files with git:
git clone https://github.com/Mid0aria/epicrpgfarmbot
# Optionally you can also download from github at https://github.com/Mid0aria/epicrpgfarmbot/archive/refs/heads/main.zip

# Enter into the cloned directory:
cd epicrpgfarmbot

# Configure the bot:
notepad config.json # On windows
nano config.json # On linux, can also use any other preferred file writing software

# Run the bot:
start ./start.bat
or
node bot.js

# Start Bot:
In config.json, type [prefix]start (example: e!start) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Stop Bot:
In config.json, type [prefix]stop (example: e!stop) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Resume Bot:
In config.json, type [prefix]resume (example: e!resume) with the prefix you set in config.json to the channel whose ID you entered in channelid
```

### 📱・Android / iOS (Termux)

```bash
# Install:

apt update -y && apt upgrade -y && pkg install wget
wget https://raw.githubusercontent.com/mid0aria/epicrpgfarmbot/main/termux-setup.sh
sh termux-setup.sh

# Configure the bot:

cd epicrpgfarmbot
nano config.json

# Run the bot:
sh start.sh
or
node bot.js

# Start Bot:
In config.json, type [prefix]start (example: e!start) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Stop Bot:
In config.json, type [prefix]stop (example: e!stop) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Resume Bot:
In config.json, type [prefix]resume (example: e!resume) with the prefix you set in config.json to the channel whose ID you entered in channelid
```
