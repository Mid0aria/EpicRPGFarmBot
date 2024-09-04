const cp = require("child_process");
// auto install dependencies
const packageJson = require("./package.json");
for (let dep of Object.keys(packageJson.dependencies)) {
    try {
        require.resolve(dep);
    } catch (err) {
        console.log(`Installing dependencies...`);
        cp.execSync(`npm i`);
    }
}

const { logger } = require("./utils/logger");
const fs = require("fs");

const axios = require("axios");
const path = require("path");
const admZip = require("adm-zip");
const os = require("os");
const fse = require("fs-extra");

const gitUpdate = () => {
    try {
        cp.execSync("git stash");
        logger.info("Updater", "Git", "Pulling ...");
        cp.execSync("git pull --force");
        logger.info("Updater", "Git", "Pull successful.");
        logger.info("Updater", "Git", "Resetting local changes...");
        cp.execSync("git reset --hard");
        logger.info("Updater", "Zip", "Project updated successfully.");
        process.exit(0);
    } catch (error) {
        logger.alert(
            "Updater",
            "Git",
            `Error updating project from Git: ${error}`
        );
        process.exit(0);
    }
};
const manualUpdate = async () => {
    try {
        const headers = {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537",
        };
        const res = await axios.get(
            `https://github.com/Mid0aria/EpicRPGFarmBot/archive/master.zip`,
            {
                responseType: "arraybuffer",
                headers,
            }
        );

        const updatePath = path.resolve(__dirname, "updateCache.zip");
        fs.writeFileSync(updatePath, res.data);

        const zip = new admZip(updatePath);
        const zipEntries = zip.getEntries();
        zip.extractAllTo(os.tmpdir(), true);

        const updateFolder = path.join(os.tmpdir(), zipEntries[0].entryName);
        if (!fs.existsSync(updateFolder)) {
            logger.alert(
                "Updater",
                "Zip",
                "Failed To Extract Files! Please update on https://github.com/Mid0aria/EpicRPGFarmBot/"
            );
        }

        fse.copySync(updateFolder, process.cwd(), { overwrite: true });
        logger.info("Updater", "Zip", "Project updated successfully.");
        process.exit(0);
    } catch (error) {
        logger.alert(
            "Updater",
            "Zip",
            `Error updating project from GitHub Repo: ${error}`
        );
        process.exit(0);
    }
};
const checkUpdate = async () => {
    console.log(
        chalk.blue(chalk.bold(`Updater`)),
        chalk.white(`>>`),
        chalk.yellow(`Checking Update`)
    );
    try {
        const headers = {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537",
        };
        const response = await axios.get(
            `https://raw.githubusercontent.com/Mid0aria/EpicRPGFarmBot/main/package.json`,
            {
                headers,
            }
        );
        const ghVersion = response.data.version;
        const version = packageJson.version;
        if (ghVersion > version) {
            console.log(
                chalk.blue(chalk.bold("Updater")),
                chalk.white(`>>`),
                chalk.yellow("Please wait while the farm bot is updating...")
            );
            if (fs.existsSync(".git")) {
                try {
                    cp.execSync("git --version");
                    logger.info("Git", "Updating with Git...");
                    gitUpdate();
                } catch (error) {
                    console.log(
                        chalk.blue(chalk.bold("Git")),
                        chalk.white(`>>`),
                        chalk.red(
                            "Git is not installed on this device. Files will be updated with cache system"
                        )
                    );
                    await manualUpdate();
                }
            } else {
                await manualUpdate();
            }
        } else {
            console.log(
                chalk.blue(chalk.bold("Updater")),
                chalk.white(`>>`),
                chalk.yellow("No Update Found")
            );
        }
    } catch (error) {
        console.log(
            chalk.blue(chalk.bold("Updater")),
            chalk.white(`>>`),
            chalk.red(`Failed To Check For Update: ${error}`)
        );
    }
};

const config = require("./config.json");
const chalk = require("chalk");

//client
const { Client, Collection, RichPresence } = require("discord.js-selfbot-v13");
const client = new Client();
let epicrpgfarm = {
    name: "epicrpgfarmbot",
    paused: true,
    captchadetected: false,
    use: false,
    daily: false,
    weekly: false,
    training: false,
    farm: false,
    totalcaptcha: 0,
    totalhunt: 0,
    totaladventure: 0,
    totaltraining: 0,
    totalevent: 0,
    totalspecialtrade: 0,
    totalarena: 0,
    totalworking: 0,
    inventory: {
        lifepotion: 0,
        arenacookie: 0,
        timecookie: 0,
        farm: {
            seed: 0,
            potatoseed: 0,
            carrotseed: 0,
            breadseed: 0,
        },
    },
    limits: {
        lifepotionhplimit: 0,
    },
};

const notifier = require("node-notifier");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function rpc(type) {
    let status = new RichPresence(client)
        .setApplicationId("1247534105944657941")
        .setType("PLAYING")
        .setName("EpicRPG Farm Bot")
        .setDetails("Auto Farming")
        .setState(
            `${client.global.paused ? "Paused" : "Running"} / Membership: ${
                apiprojectpremiumresponse ? "Premium" : "Free"
            }`
        )
        .setStartTimestamp(Date.now())
        .setAssetsLargeImage("1247534454000586782")
        .setAssetsLargeText("Epic RPG")
        .addButton("Farm Bot", "https://github.com/Mid0aria/EpicRPGFarmBot")
        .addButton("Discord", "https://discord.gg/WzYXVbXt6C");

    if (config.settings.discordrpc) {
        client.user.setPresence({ activities: [status] });
        logger.info(
            "RPC",
            type,
            `${client.global.paused ? "Paused" : "Running"}`
        );
    }
}
client.chalk = chalk;
client.fs = fs;
client.notifier = notifier;
client.axios = axios;

client.childprocess = cp;
client.config = config;
client.delay = delay;
client.global = epicrpgfarm;
client.rpc = rpc;
if (os.userInfo().username !== "Mido") {
    client.global.devmode = false;
}
var krf = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣤⣤⣤⣤⣤⣤⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠻⠿⢿⣿⣿⣿⣿⣿⣶⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣿⣿⣿⣿⣿⣿⣶⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣷⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣙⢿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠻⣿⣿⣿⣿⣿⣿⣿⣄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⡟⠹⠿⠟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡿⠋⡬⢿⣿⣷⣤⣤⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⡇⢸⡇⢸⣿⣿⣿⠟⠁⢀⣬⢽⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣧⣈⣛⣿⣿⣿⡇⠀⠀⣾⠁⢀⢻⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣧⣄⣀⠙⠷⢋⣼⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁
⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀
⠸⣿⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀
⠀⢹⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀
⠀⠀⠹⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀
⠀⠀⠀⠙⣿⣿⣿⣿⣿⣶⣤⣀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠛⠛⠛⠛⠛⠛⠛⠋⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`;
process.title = `Epic RPG Farm Bot v${packageJson.version}`;
console.log(krf);

["aliases", "commands"].forEach((x) => (client[x] = new Collection()));
fs.readdirSync("./handlers").forEach((file) => {
    require(`./handlers/${file}`)(client);
});
let isittokenohmaybeitstoken = "https://syan.anlayana.com/uryczr";
client.login(config.token);
checkUpdate();
