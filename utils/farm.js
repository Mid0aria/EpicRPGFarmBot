const { logger } = require("./logger");

module.exports = async (client, message) => {
    if (client.global.paused || client.global.captchadetected) return;
    logger.info("Farm", "Paused", client.global.paused);
    let channel = client.channels.cache.get(client.config.channelid);
    if (
        client.config.settings.inventory.check &&
        client.config.settings.inventory.lifepotion.autouse
    ) {
        use(client, channel, "life potion", "", "inventory");
        await client.delay(2500);
    }

    if (client.config.settings.inventory.check) {
        inventory(client, channel);
    } else {
        checkcooldowns(client, channel);
    }
};

/**
 * INVENTORY & COOLDOWN
 *
 */

async function inventory(client, channel, type = null) {
    if (client.global.captchadetected) return;
    client.global.paused = true;
    logger.info("Farm", "Inventory", `Paused: ${client.global.paused}`);
    logger.info("Farm", "Inventory", `Getting Inventory ...`);

    await channel.send({ content: "rpg inventory" }).then(async () => {
        let message = null;
        do {
            let lastMessages = await channel.messages.fetch({ limit: 1 });
            if (lastMessages.size > 0) {
                message = lastMessages.last();
                if (message.author.id !== "555955826880413696") {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }
        } while (message && message.author.id !== "555955826880413696");

        const fields = message.embeds[0].fields;

        if (type === "sell") {
            let itemsValue = null;

            for (const field of fields) {
                if (field.name === "Items") {
                    itemsValue = field.value;
                    break;
                }
            }
            const sellTypes = client.config.settings.inventory.sell.types;
            const itemsitemsToCheck = [];

            for (const type in sellTypes) {
                if (sellTypes[type]) {
                    itemsitemsToCheck.push(type);
                }
            }
            const itemslines = itemsValue.split("\n");
            inventorysellloopcounter = 0;
            for (const line of itemslines) {
                const trimmedLine = line.trim();
                if (trimmedLine.toLowerCase().includes("no items")) {
                    logger.warn("Farm", "Inventory", `No items left`);
                } else {
                    for (const item of itemsitemsToCheck) {
                        if (trimmedLine.includes(item)) {
                            const regex = new RegExp(
                                `\\*\\*${item}\\*\\*: (\\d+)`
                            );
                            const match = trimmedLine.match(regex);
                            if (match && match.length > 1) {
                                const count = match[1];

                                switch (inventorysellloopcounter) {
                                    case 0:
                                        await client.delay(2500);
                                        inventorysellloopcounter++;
                                        break;
                                    case 1:
                                        await client.delay(3500);
                                        inventorysellloopcounter++;
                                        break;
                                    case 2:
                                        await client.delay(4500);
                                        inventorysellloopcounter++;
                                        break;
                                    case 4:
                                        await client.delay(5500);
                                        inventorysellloopcounter++;
                                        break;
                                    default:
                                        await client.delay(6500);
                                        inventorysellloopcounter++;
                                        break;
                                }

                                await sell(
                                    client,
                                    channel,
                                    item,
                                    count,
                                    "inventory"
                                );
                            }
                        }
                    }
                }
            }
            client.global.paused = false;
            logger.info("Farm", "Inventory", `Paused: ${client.global.paused}`);
        } else if (type === "use") {
            let useconsumablesValue = null;

            for (const field of fields) {
                if (field.name === "Consumables") {
                    useconsumablesValue = field.value;
                    break;
                }
            }

            const lootboxTypes = client.config.settings.inventory.lootbox.types;
            const useconsumablesitemsToCheck = [];

            for (const type in lootboxTypes) {
                if (lootboxTypes[type]) {
                    useconsumablesitemsToCheck.push(type);
                }
            }

            const useconsumableslines = useconsumablesValue.split("\n");
            usecooldown = 0;
            inventoryuseloopcounter = 0;
            for (const line of useconsumableslines) {
                const trimmedLine = line.trim();

                for (const item of useconsumablesitemsToCheck) {
                    if (trimmedLine.includes(item)) {
                        const regex = new RegExp(`\\*\\*${item}\\*\\*: (\\d+)`);
                        const match = trimmedLine.match(regex);
                        if (match && match.length > 1) {
                            const count = match[1];

                            if (
                                item.includes("lootbox") &&
                                client.config.settings.inventory.lootbox.autouse
                            ) {
                                switch (inventoryuseloopcounter) {
                                    case 0:
                                        await client.delay(2500);
                                        break;
                                    case 1:
                                        await client.delay(5500);
                                        break;
                                    case 2:
                                        await client.delay(7500);
                                        break;
                                    case 4:
                                        await client.delay(9500);
                                        break;
                                    default:
                                        await client.delay(11500);
                                        break;
                                }

                                await use(
                                    client,
                                    channel,
                                    item,
                                    count,
                                    "inventory"
                                );
                                inventoryuseloopcounter++;
                            }
                        }
                    }
                }
            }
            client.global.paused = false;
            logger.info("Farm", "Inventory", `Paused: ${client.global.paused}`);
        } else {
            let consumablesValue = null;

            for (const field of fields) {
                if (field.name === "Consumables") {
                    consumablesValue = field.value;
                    break;
                }
            }

            const lootboxTypes = client.config.settings.inventory.lootbox.types;
            const farmseedTypes = client.config.commands.progress.farm.types;
            const consumablesitemsToCheck = [
                "life potion",
                "time cookie",
                "common card",
            ];

            for (const type in lootboxTypes) {
                if (lootboxTypes[type]) {
                    consumablesitemsToCheck.push(type);
                }
            }
            for (const type in farmseedTypes) {
                if (farmseedTypes[type]) {
                    consumablesitemsToCheck.push(type);
                }
            }

            const consumableslines = consumablesValue.split("\n");
            usecooldown = 0;
            inventoryuseloopcounter = 0;
            for (const line of consumableslines) {
                const trimmedLine = line.trim();

                for (const item of consumablesitemsToCheck) {
                    if (trimmedLine.includes(item)) {
                        const regex = new RegExp(`\\*\\*${item}\\*\\*: (\\d+)`);
                        const match = trimmedLine.match(regex);
                        if (match && match.length > 1) {
                            const count = match[1];
                            if (
                                item === "life potion" &&
                                client.config.settings.inventory.lifepotion
                                    .autouse
                            ) {
                                client.global.inventory.lifepotion = count;
                                client.global.limits.lifepotionhplimit =
                                    client.config.settings.inventory.lifepotion.hplimit;
                            } else if (item === "time cookie") {
                                client.global.inventory.timecookie = count;
                            } else if (
                                item.includes("lootbox") &&
                                client.config.settings.inventory.lootbox.autouse
                            ) {
                                switch (inventoryuseloopcounter) {
                                    case 0:
                                        await client.delay(2500);
                                        break;
                                    case 1:
                                        await client.delay(5500);
                                        break;
                                    case 2:
                                        await client.delay(7500);
                                        break;
                                    case 4:
                                        await client.delay(9500);
                                        break;
                                    default:
                                        await client.delay(11500);
                                        break;
                                }

                                await use(
                                    client,
                                    channel,
                                    item,
                                    count,
                                    "inventory"
                                );
                                inventoryuseloopcounter++;
                            } else if (
                                item.includes("seed") &&
                                client.config.commands.progress.farm.enable
                            ) {
                                switch (item) {
                                    case "seed":
                                        client.global.inventory.farm.seed =
                                            count;
                                        break;
                                    case "potato seed":
                                        client.global.inventory.farm.potatoseed =
                                            count;
                                        break;
                                    case "carrot seed":
                                        client.global.inventory.farm.carrotseed =
                                            count;
                                        break;
                                    case "bread seed":
                                        client.global.inventory.farm.breadseed =
                                            count;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }
                }
            }
            //
            client.global.paused = false;
            logger.info("Farm", "Inventory", `Paused: ${client.global.paused}`);
            if (usecooldown > 0) {
                setTimeout(() => {
                    checkcooldowns(client, channel);
                }, 4500 + usecooldown);
            } else {
                setTimeout(() => {
                    checkcooldowns(client, channel);
                }, 4500);
            }
        }
    });
}

async function checkcooldowns(client, channel) {
    await channel.send({ content: "rpg cd" }).then(async () => {
        let message = null;
        do {
            let lastMessages = await channel.messages.fetch({ limit: 1 });
            if (lastMessages.size > 0) {
                message = lastMessages.last();
                if (message.author.id !== "555955826880413696") {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }
        } while (message && message.author.id !== "555955826880413696");

        const itemsToCheck = [
            "daily",
            "weekly",
            "lootbox",
            "card hand",
            "vote",
            "hunt",
            "adventure",
            "training",
            "duel",
            "quest",
            "epic quest",
            "chop",
            "fish",
            "pickup",
            "mine",
            "horse breeding",
            "horse race",
            "arena",
            "dungeon",
            "miniboss",
            "farm",
        ];
        let dailycooldown,
            weeklycooldown,
            votecooldown,
            huntcooldown,
            adventurecooldown,
            trainingcooldown,
            farmcooldown,
            chopcooldown,
            fishcooldown,
            pickupcooldown,
            minecooldown,
            axecooldown,
            netcooldown,
            laddercooldown,
            progressworkingdisabled,
            progressworkingmultivalue;

        for (const category in client.config.commands) {
            const subCommands = client.config.commands[category];
            for (const subCommand in subCommands) {
                if (subCommands[subCommand]) {
                    if (subCommand === "daily") {
                        dailycooldown = 0;
                    }
                    if (subCommand === "weekly") {
                        weeklycooldown = 0;
                    }
                    if (subCommand === "vote") {
                        votecooldown = 0;
                    }
                    if (subCommand === "hunt") {
                        huntcooldown = 0;
                    }
                    if (subCommand === "adventure") {
                        adventurecooldown = 0;
                    }
                    if (subCommand === "training") {
                        trainingcooldown = 0;
                    }

                    if (category === "progress" && subCommand === "farm") {
                        farmcooldown = 0;

                        /*  const workingCommands = subCommands["working"];

                        if (
                            client.config.commands.progress.farm.enable &&
                            Object.values(workingCommands).some(
                                (value) => value === true
                            )
                        ) {
                            progressworkingdisabled = true;
                            logger.warn(
                                "Farm",
                                "Progress",
                                "You cannot use both working and farm commands at the same time. working commands will be disabled and farm will be used by default"
                            );
                        }*/
                    }

                    if (category === "progress" && subCommand === "working") {
                        const progressCommands = subCommands[subCommand];
                        if (progressCommands) {
                            if (
                                Object.values(progressCommands).filter(
                                    (value) => value
                                ).length > 1
                            ) {
                                logger.warn(
                                    "Farm",
                                    "Progress",
                                    "Multiple working commands detected, chop will be used by default"
                                );
                                progressworkingmultivalue = true;
                                client.global.working.type = "chop";
                                chopcooldown = 0;
                            } else {
                                progressworkingmultivalue = false;
                            }
                        }
                    }
                }
            }
        }
        message.embeds[0].fields.forEach((field) => {
            const { name, value } = field;
            if (name === ":lock: Locked") {
                return;
            }
            const lines = value.split("\n");
            lines.forEach((line) => {
                const trimmedLine = line.trim();
                itemsToCheck.forEach((item) => {
                    if (trimmedLine.includes(item)) {
                        const cooldown = extractCooldown(trimmedLine);
                        if (cooldown) {
                            if (
                                item === "daily" &&
                                client.config.commands.rewards.daily
                            ) {
                                dailycooldown = timetoms(cooldown);
                                logger.info(
                                    "Farm",
                                    "Cooldowns",
                                    `Daily Cooldown: ${dailycooldown}ms`
                                );
                            }
                            if (
                                item === "weekly" &&
                                client.config.commands.rewards.weekly
                            ) {
                                weeklycooldown = timetoms(cooldown);
                                logger.info(
                                    "Farm",
                                    "Cooldowns",
                                    `Weekly Cooldown: ${weeklycooldown}ms`
                                );
                            }
                            if (
                                item === "vote" &&
                                client.config.commands.rewards.vote.enable
                            ) {
                                votecooldown = timetoms(cooldown);
                                logger.info(
                                    "Farm",
                                    "Cooldowns",
                                    `Vote Cooldown: ${votecooldown}ms`
                                );
                            }
                            if (
                                item === "hunt" &&
                                client.config.commands.experience.hunt
                            ) {
                                huntcooldown = timetoms(cooldown);
                                logger.info(
                                    "Farm",
                                    "Cooldowns",
                                    `Hunt Cooldown: ${huntcooldown}ms`
                                );
                            }
                            if (
                                item === "adventure" &&
                                client.config.commands.experience.adventure
                            ) {
                                adventurecooldown = timetoms(cooldown);
                                logger.info(
                                    "Farm",
                                    "Cooldowns",
                                    `Adventure Cooldown: ${adventurecooldown}ms`
                                );
                            }
                            if (
                                item === "training" &&
                                client.config.commands.experience.training
                            ) {
                                trainingcooldown = timetoms(cooldown);
                                logger.info(
                                    "Farm",
                                    "Cooldowns",
                                    `Training Cooldown: ${trainingcooldown}ms`
                                );
                            }
                            if (
                                item === "farm" &&
                                client.config.commands.progress.farm
                            ) {
                                farmcooldown = timetoms(cooldown);
                                logger.info(
                                    "Farm",
                                    "Cooldowns",
                                    `Farm Cooldown: ${farmcooldown}ms`
                                );
                            }
                            if (item === "chop") {
                                if (
                                    client.config.commands.progress.working.chop
                                ) {
                                    chopcooldown = timetoms(cooldown);
                                    logger.info(
                                        "Farm",
                                        "Cooldowns",
                                        `Chop Cooldown: ${chopcooldown}ms`
                                    );
                                }
                                if (
                                    client.config.commands.progress.working
                                        .fish &&
                                    !progressworkingmultivalue
                                ) {
                                    fishcooldown = timetoms(cooldown);
                                    logger.info(
                                        "Farm",
                                        "Cooldowns",
                                        `Fish Cooldown: ${fishcooldown}ms`
                                    );
                                }
                                if (
                                    client.config.commands.progress.working
                                        .pickup &&
                                    !progressworkingmultivalue
                                ) {
                                    pickupcooldown = timetoms(cooldown);
                                    logger.info(
                                        "Farm",
                                        "Cooldowns",
                                        `Pickup Cooldown: ${pickupcooldown}ms`
                                    );
                                }
                                if (
                                    client.config.commands.progress.working
                                        .mine &&
                                    !progressworkingmultivalue
                                ) {
                                    minecooldown = timetoms(cooldown);
                                    logger.info(
                                        "Farm",
                                        "Cooldowns",
                                        `Mine Cooldown: ${minecooldown}ms`
                                    );
                                }
                                if (
                                    client.config.commands.progress.working
                                        .axe &&
                                    !progressworkingmultivalue
                                ) {
                                    axecooldown = timetoms(cooldown);
                                    logger.info(
                                        "Farm",
                                        "Cooldowns",
                                        `Axe Cooldown: ${axecooldown}ms`
                                    );
                                }
                                if (
                                    client.config.commands.progress.working
                                        .net &&
                                    !progressworkingmultivalue
                                ) {
                                    netcooldown = timetoms(cooldown);
                                    logger.info(
                                        "Farm",
                                        "Cooldowns",
                                        `Net Cooldown: ${netcooldown}ms`
                                    );
                                }
                                if (
                                    client.config.commands.progress.working
                                        .ladder &&
                                    !progressworkingmultivalue
                                ) {
                                    laddercooldown = timetoms(cooldown);
                                    logger.info(
                                        "Farm",
                                        "Cooldowns",
                                        `Ladder Cooldown: ${laddercooldown}ms`
                                    );
                                }
                            }
                        }
                    }
                });
            });
        });

        if (client.config.commands.rewards.daily) {
            if (dailycooldown <= 0) {
                client.global.daily = true;
                setTimeout(() => {
                    daily(client, channel);
                }, 1400);
            }
        }
        if (client.config.commands.rewards.weekly) {
            if (dailycooldown <= 0) {
                if (weeklycooldown <= 0) {
                    client.global.weekly = true;
                    setTimeout(() => {
                        weekly(client, channel);
                    }, 2700);
                }
            } else {
                if (weeklycooldown <= 0) {
                    client.global.weekly = true;
                    setTimeout(() => {
                        weekly(client, channel);
                    }, 1400);
                }
            }
        }
        if (client.config.commands.rewards.vote.enable) {
            if (dailycooldown <= 0 || weeklycooldown <= 0) {
                if (votecooldown <= 0) {
                    setTimeout(() => {
                        vote(client, channel);
                    }, 2700);
                }
            } else {
                if (votecooldown <= 0) {
                    setTimeout(() => {
                        vote(client, channel);
                    }, 1400);
                }
            }
        }
        if (client.config.commands.experience.hunt) {
            if (dailycooldown <= 0) {
                if (huntcooldown > 0) {
                    hunt(client, channel, huntcooldown + 2000);
                } else {
                    hunt(client, channel, 2000);
                }
            } else {
                if (huntcooldown > 0) {
                    setTimeout(() => {
                        hunt(client, channel);
                    }, huntcooldown);
                } else {
                    hunt(client, channel);
                }
            }
        }
        if (client.config.commands.experience.adventure) {
            if (adventurecooldown > 0) {
                adventure(client, channel, adventurecooldown + 2000);
            } else {
                adventure(client, channel, 3500);
            }
        }
        if (client.config.commands.experience.training) {
            if (trainingcooldown > 0) {
                training(client, channel, trainingcooldown + 2000);
            } else {
                training(client, channel, 3500);
            }
        }

        if (client.config.commands.progress.farm.enable) {
            if (farmcooldown > 0) {
                farm(client, channel, farmcooldown + 2000);
            } else {
                farm(client, channel, 5500);
            }
        }
        if (
            client.config.commands.progress.working.chop ||
            progressworkingmultivalue
        ) {
            if (chopcooldown > 0) {
                working(client, channel, "chop", chopcooldown + 3500);
            } else {
                working(client, channel, "chop", 7500);
            }
        }

        if (
            client.config.commands.progress.working.fish &&
            !progressworkingmultivalue
        ) {
            if (fishcooldown > 0) {
                working(client, channel, "fish", fishcooldown + 3500);
            } else {
                working(client, channel, "fish", 7500);
            }
        }
        if (
            client.config.commands.progress.working.pickup &&
            !progressworkingmultivalue
        ) {
            if (pickupcooldown > 0) {
                working(client, channel, "pickup", pickupcooldown + 3500);
            } else {
                working(client, channel, "pickup", 7500);
            }
        }
        if (
            client.config.commands.progress.working.mine &&
            !progressworkingmultivalue
        ) {
            if (minecooldown > 0) {
                working(client, channel, "mine", minecooldown + 3500);
            } else {
                working(client, channel, "mine", 7500);
            }
        }
        if (
            client.config.commands.progress.working.axe &&
            !progressworkingmultivalue
        ) {
            if (axecooldown > 0) {
                working(client, channel, "axe", axecooldown + 3500);
            } else {
                working(client, channel, "axe", 7500);
            }
        }
        if (
            client.config.commands.progress.working.net &&
            !progressworkingmultivalue
        ) {
            if (netcooldown > 0) {
                working(client, channel, "net", netcooldown + 3500);
            } else {
                working(client, channel, "net", 7500);
            }
        }
        if (
            client.config.commands.progress.working.ladder &&
            !progressworkingmultivalue
        ) {
            if (laddercooldown > 0) {
                working(client, channel, "ladder", laddercooldown + 3500);
            } else {
                working(client, channel, "ladder", 7500);
            }
        }
    });
}

/**
 * COMMAND FUNCTIONS
 *
 */

async function hunt(client, channel, extratime = 0) {
    setTimeout(async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.daily ||
            client.global.weekly
        )
            return;
        if (
            client.config.settings.inventory.check &&
            client.config.settings.inventory.lifepotion.autouse &&
            client.global.inventory.lifepotion !== 0
        ) {
            use(client, channel, "life potion", "", "hunt");
            await client.delay(2500);
            if (client.config.settings.autophrases) {
                setTimeout(async () => {
                    await elaina2(client, channel);
                }, 1000);
            }

            await channel.send({ content: "rpg hunt" }).then(async () => {
                client.global.totalhunt++;
                logger.info(
                    "Farm",
                    "Hunt",
                    `Total Hunt: ${client.global.totalhunt}`
                );
                let message = null;
                do {
                    let lastMessages = await channel.messages.fetch({
                        limit: 1,
                    });
                    if (lastMessages.size > 0) {
                        message = lastMessages.last();
                        if (message.author.id !== "555955826880413696") {
                            await new Promise((resolve) =>
                                setTimeout(resolve, 1000)
                            );
                        }
                    }
                } while (message && message.author.id !== "555955826880413696");
            });
        } else {
            await channel.send({ content: "rpg hunt" }).then(() => {
                client.global.totalhunt++;
                logger.info(
                    "Farm",
                    "Hunt",
                    `Total Hunt: ${client.global.totalhunt}`
                );
                if (client.config.settings.autophrases) {
                    setTimeout(async () => {
                        await elaina2(client, channel);
                    }, 1000);
                }
            });
        }
    }, 1000 + extratime);

    setInterval(async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.daily ||
            client.global.weekly
        )
            return;
        if (
            client.config.settings.inventory.check &&
            client.config.settings.inventory.lifepotion.autouse &&
            client.global.inventory.lifepotion !== 0
        ) {
            await channel.send({ content: "rpg hunt" }).then(async () => {
                client.global.totalhunt++;
                logger.info(
                    "Farm",
                    "Hunt",
                    `Total Hunt: ${client.global.totalhunt}`
                );
                let message = null;
                do {
                    let lastMessages = await channel.messages.fetch({
                        limit: 1,
                    });
                    if (lastMessages.size > 0) {
                        message = lastMessages.last();
                        if (message.author.id !== "555955826880413696") {
                            await new Promise((resolve) =>
                                setTimeout(resolve, 1000)
                            );
                        }
                    }
                } while (message && message.author.id !== "555955826880413696");
                const hpregex = /HP is (\d+)\/\d+/;

                const match = message.content.match(hpregex);
                if (match && match.length > 1) {
                    const hpValue = match[1];
                    logger.info("Farm", "Hunt", `HP: ${hpValue}`);
                    if (hpValue <= client.global.limits.lifepotionhplimit) {
                        await client.delay(2000);
                        use(client, channel, "life potion", "", "hunt");
                    }
                } else {
                    logger.warn("Farm", "Hunt", `Unable to get HP value`);
                }
                if (client.config.settings.inventory.sell.enable) {
                    await client.delay(2000);
                    await inventory(client, channel, "sell");
                    await client.delay(5000);
                }
            });
        } else {
            await channel.send({ content: "rpg hunt" }).then(async () => {
                client.global.totalhunt++;
                logger.info(
                    "Farm",
                    "Hunt",
                    `Total Hunt: ${client.global.totalhunt}`
                );
                if (client.config.settings.inventory.sell.enable) {
                    await client.delay(2000);
                    await inventory(client, channel, "sell");
                    await client.delay(5000);
                }
            });
        }
    }, 63000 + 1000 + extratime);
}

async function adventure(client, channel, extratime = 0) {
    setTimeout(async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.daily ||
            client.global.weekly
        )
            return;
        use(client, channel, "life potion", "", "adventure");
        await client.delay(2500);
        await channel.send({ content: "rpg adventure" }).then(async () => {
            client.global.totaladventure++;
            logger.info(
                "Farm",
                "Adventure",
                `Total adventure: ${client.global.totaladventure}`
            );
            await client.delay(2500);
            use(client, channel, "life potion", "", "adventure");
        });
    }, 1000 + extratime);

    setInterval(async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.daily ||
            client.global.weekly
        )
            return;
        use(client, channel, "life potion", "", "adventure");
        await client.delay(2500);

        await channel.send({ content: "rpg adventure" }).then(async () => {
            client.global.totaladventure++;
            logger.info(
                "Farm",
                "Adventure",
                `Total adventure: ${client.global.totaladventure}`
            );
            await client.delay(2500);
            use(client, channel, "life potion", "", "adventure");
        });
    }, 3602000 + 1000 + extratime);
}

async function training(client, channel, extratime = 0) {
    setTimeout(async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.daily ||
            client.global.weekly ||
            client.global.farm
        )
            return;

        await channel.send({ content: "rpg training" }).then(async () => {
            client.global.totaltraining++;
            logger.info(
                "Farm",
                "Training",
                `Total training: ${client.global.totaltraining}`
            );
        });
    }, 1000 + extratime);

    setInterval(async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.daily ||
            client.global.weekly ||
            client.global.farm
        )
            return;

        await channel.send({ content: "rpg training" }).then(async () => {
            client.global.totaltraining++;
            logger.info(
                "Farm",
                "Training",
                `Total training: ${client.global.totaltraining}`
            );
        });
    }, 902000 + 1000 + extratime);
}

async function farm(client, channel, extratime = 0) {
    let farmseedtype;

    setTimeout(async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.daily ||
            client.global.weekly ||
            client.global.training
        )
            return;
        if (client.global.inventory.farm.seed >= 1) {
            farmseedtype = "basic";
        } else if (client.global.inventory.farm.potatoseed >= 1) {
            farmseedtype = "potato seed";
        } else if (client.global.inventory.farm.carrotseed >= 1) {
            farmseedtype = "carrot seed";
        } else if (client.global.inventory.farm.breadseed >= 1) {
            farmseedtype = "bread seed";
        }

        await channel.send({ content: `rpg farm ${farmseedtype}` }).then(() => {
            client.global.totalworking++;
            logger.info("Farm", "Progress-Farm", `Type: ${farmseedtype}`);
        });
    }, 1000 + extratime);

    setInterval(async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.daily ||
            client.global.weekly ||
            client.global.training
        )
            return;
        if (client.global.inventory.farm.seed >= 1) {
            farmseedtype = "basic";
        } else if (client.global.inventory.farm.potatoseed >= 1) {
            farmseedtype = "potato seed";
        } else if (client.global.inventory.farm.carrotseed >= 1) {
            farmseedtype = "carrot seed";
        } else if (client.global.inventory.farm.breadseed >= 1) {
            farmseedtype = "bread seed";
        }
        await channel.send({ content: `rpg farm ${farmseedtype}` }).then(() => {
            logger.info("Farm", "Progress-Farm", `Type: ${farmseedtype}`);
        });
    }, 903500 + extratime);
}

async function working(client, channel, type, extratime = 0) {
    setTimeout(async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.daily ||
            client.global.weekly
        )
            return;
        await channel.send({ content: `rpg ${type}` }).then(() => {
            client.global.totalworking++;
            logger.info("Farm", "Working", `Type: ${type}`);
        });
    }, 1000 + extratime);

    setInterval(async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.daily ||
            client.global.weekly
        )
            return;
        await channel.send({ content: `rpg ${type}` }).then(() => {
            logger.info("Farm", "Working", `Type: ${type}`);
        });
    }, 302000 + extratime);
}

async function daily(client, channel) {
    if (
        client.global.paused ||
        client.global.captchadetected ||
        client.global.use
    )
        return;
    await channel.send({ content: "rpg daily" }).then(() => {
        logger.info("Farm", "Daily", "Daily Claimed !");
    });
    await client.delay(2500);
    client.global.daily = false;
}
async function weekly(client, channel) {
    if (
        client.global.paused ||
        client.global.captchadetected ||
        client.global.use
    )
        return;
    await channel.send({ content: "rpg weekly" }).then(() => {
        logger.info("Farm", "Weekly", "Weekly Claimed !");
    });
    await client.delay(2500);
    client.global.weekly = false;
}

async function vote(client, channel) {
    if (
        client.global.paused ||
        client.global.captchadetected ||
        client.global.use ||
        client.global.daily ||
        client.global.weekly
    )
        return;

    logger.info("Farm", "Vote", `Platform: ${process.platform}`);

    let votebrowserexecute, executeCommand;

    if (process.platform === "win32") {
        votebrowserexecute = "start";
        executeCommand = (command) => client.childprocess.exec(command);
    } else if (process.platform === "darwin") {
        votebrowserexecute = "open";
        executeCommand = (command) =>
            client.childprocess.spawn(command, [
                "https://top.gg/bot/555955826880413696/vote",
            ]);
    } else if (process.platform === "android") {
        return;
    } else if (process.platform === "linux") {
        votebrowserexecute = "xdg-open";
        executeCommand = (command) =>
            client.childprocess.spawn(command, [
                "https://top.gg/bot/555955826880413696/vote",
            ]);
    } else {
        logger.warn("Farm", "Vote", "Unsupported platform!");
        return;
    }

    if (votebrowserexecute) {
        logger.info("Farm", "Vote", "Opening Browser.");
        executeCommand(
            `${votebrowserexecute} https://top.gg/bot/555955826880413696/vote`
        );
    }
}

async function use(client, channel, item, count = "", where = "") {
    if (
        (client.global.paused && where !== "inventory") ||
        client.global.captchadetected
    )
        return;
    client.global.use = true;
    await channel.send({ content: `rpg use ${item} ${count}` });
    if (where.trim() !== "") {
        logger.info("Farm", `Use [Requested By ${where}]`, item);
    } else {
        logger.info("Farm", "Use", item);
    }

    if (where === "adventure" || where === "hunt") {
        await client.delay("2500");
    } else {
        await client.delay("1500");
    }
    client.global.use = false;
}

async function sell(client, channel, item, count = "1", where = "") {
    if (client.global.paused && where !== "inventory") return;
    await channel.send({ content: `rpg sell ${item} ${count}` });
    logger.info("Farm", "Sell", item);
    // if (where === "inventory") {
    //     await client.delay(2500);
    // }
}

/**
 * OTHER FUNCTIONS
 *
 */

async function elaina2(client, channel) {
    if (client.global.paused || client.global.captchadetected) return;
    client.fs.readFile("./phrases/phrases.json", "utf8", async (err, data) => {
        if (err) {
            console.error(err);
            return diagnosticreport(err);
        }

        const phrasesObject = JSON.parse(data);
        const phrases = phrasesObject.phrases;

        if (!phrases || !phrases.length) {
            logger.alert(
                "Farm",
                "Phrases",
                "Phrases array is undefined or empty."
            );
            return;
        }
        let result = Math.floor(Math.random() * phrases.length);
        let ilu = phrases[result];

        // await channel.sendTyping();

        await channel.send({ content: ilu });
        logger.info("Farm", "Phrases", `Successfuly Sended`);
    });
}

function timetoms(durationString) {
    const regex =
        /(\d+)\s*d\s*|(\d+)\s*h\s*|(\d+)\s*m\s*|(\d+)\s*s\s*|(\d+)\s*$/g;
    const matches = durationString.match(regex);

    if (!matches) return null;

    let milliseconds = 0;

    matches.forEach((match) => {
        const value = parseInt(match.match(/\d+/)[0]);
        if (match.includes("d")) milliseconds += value * 24 * 60 * 60 * 1000;
        else if (match.includes("h")) milliseconds += value * 60 * 60 * 1000;
        else if (match.includes("m")) milliseconds += value * 60 * 1000;
        else if (match.includes("s")) milliseconds += value * 1000;
        else milliseconds += value;
    });

    return milliseconds;
}

function extractCooldown(text) {
    const cooldownRegex = /\(\*\*([^*]+)\*\*\)/;
    const cooldownMatch = text.match(cooldownRegex);
    if (cooldownMatch && cooldownMatch.length > 1) {
        return cooldownMatch[1];
    }
    return null;
}
