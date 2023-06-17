// Require the necessary discord.js classes
const {GatewayIntentBits, Client} = require("discord.js");
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // This is required to get the message content,
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", message => {
    // check if the message is "ping"
    if (message.content === "ping") {
        // send back "Pong." to the channel the message was sent in
        message.reply("Pong.");
    }

    // check if the message is "give me admin role"
    if (message.content === "give me admin role") {
        // check if exists admin role
        if (message.guild.roles.cache.find(role => role.name === "admin")) {
            // add the role to the user
            message.member.roles.add(message.guild.roles.cache.find(role => role.name === "admin"));

            // send a message to the channel
            message.reply("You have been given the admin role");
        } else {
            // create the role
            message.guild.roles.create({
                name: 'admin',
                color: 'BLUE',
                reason: 'we needed a role for admins',
            }).then(r => {
                // add the role to the user
                message.reply("I created the admin role for you");
                console.log(`Created new role with name ${r.name} and color ${r.color}`);
                message.member.roles.add(r);
            })
        }
    }

    // check if the message is "remove my admin role"
    if (message.content === "remove my admin role") {
        // check if exists admin role
        if (message.guild.roles.cache.find(role => role.name === "admin")) {
            // remove the role from the user
            message.member.roles.remove(message.guild.roles.cache.find(role => role.name === "admin"));
            // send a message to the channel
            message.reply("You have been removed the admin role");
        }
    }

    // check if the message is "wash my hands pls"
    if (message.content === "wash my hands pls") {
        //send a message to the channel
        message.channel.send("Washing hands...").then(msg => {
            //after 5 seconds, edit the message
            setTimeout(() => {
                msg.edit("Washed hands!");
            }, 5000);
        })

    }

    // check if the message includes in lowercase "Rick Astley" or "Rickroll" or "roll me"
    if (message.content.toLowerCase().includes("rick astley") || message.content.toLowerCase().includes("rickroll") || message.content.toLowerCase().includes("roll me")) {
        // send a link to Rick Astley's Never Gonna Give You Up
        message.reply("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    }

    // search youtube for the message content
    if (message.content.startsWith("youtube ")) {
        // get the search query
        const query = message.content.replace("youtube ", "");
        // search youtube
        message.reply(`https://www.youtube.com/results?search_query=${query}`);
    }

    // search how to do something on google
    if (message.content.startsWith("how to ")) {
        // get the search query
        const query = message.content.replace("how to ", "");
        // search google
        message.reply(`https://www.google.com/search?q=how+to+${query}`);
    }

    // can i do something
    if (message.content.toLowerCase().startsWith("can i ")) {
        // give a random answer

        // get a random number between 0 and 1
        const random = Math.random();
        // if the random number is less than 0.5, send a yes message
        if (random < 0.5) {
            message.reply("Yes");
        }
        // if the random number is greater than 0.5, send a no message
        if (random > 0.5) {
            message.reply("No");
        }
        // if the random number is equal to 0.5, send a maybe message
        if (random === 0.5) {
            message.reply("Maybe");
        }
    }

    // can you do something
    if (message.content.toLowerCase().startsWith("can you ")) {
        // give a random answer

        // get a random number between 0 and 1
        const random = Math.random();
        // if the random number is less than 0.5, send a yes message
        if (random < 0.5) {
            message.reply("Yes");
        }
        // if the random number is greater than 0.5, send a no message
        if (random > 0.5) {
            message.reply("No");
        }
        // if the random number is equal to 0.5, send a maybe message
        if (random === 0.5) {
            message.reply("Maybe");
        }
    }
    // start a poll then count the votes after 5 minutes and send the results
    if (message.content.startsWith("poll ")) {
        // get the poll question
        const question = message.content.replace("poll ", "");

        // delete the existing message
        message.delete();

        // send a message with the poll question and author name
        message.channel.send(`Poll started by ${message.author.username}: ${question}`).then(msg => {
            // add the reactions
            msg.react("👍");
            msg.react("👎");

            // after 30 seconds, count the votes
            setTimeout(() => {
                // check if message exists
                if (msg) {
                    // get the reactions
                    msg.fetch().then(msg => {
                        const reactions = msg.reactions.cache;

                        // get the number of 👍 reactions
                        const upVotes = reactions.get("👍").count - 1;
                        // get the number of 👎 reactions
                        const downVotes = reactions.get("👎").count - 1;

                        // send the results
                        message.channel.send(`Poll results: ${question}\nUpvotes: ${upVotes}\nDownvotes: ${downVotes}`);
                    })
                }
            }, 30000);
        })
    }
    // check if the message is "what is my avatar"
    if (message.content === "what is my avatar") {
        // send the user's avatar URL
        message.reply(message.author.displayAvatarURL());
    }

    // kill a user with a random weapon and a random place (this is a joke)
    if (message.content.toLowerCase().startsWith("kill ")) {
        // check if the message mentions a user
        if (message.mentions.users.size) {
            // get the mentioned user
            const user = message.mentions.users.first();

            // check if the user is the bot then stop
            if (user.id === client.user.id) {
                // send a message
                message.reply("I'm not going to kill myself");
                return;
            }


            // get a random number between 0 and 1
            const random = Math.random();
            // if the random number is less than 0.5, send a yes message
            if (random < 0.5) {
                message.reply(`I killed ${user.username} with a knife in the kitchen`);
            }
            // if the random number is greater than 0.5, send a no message
            if (random > 0.5) {
                message.reply(`I killed ${user.username} with a gun in the living room`);
            }
            // if the random number is equal to 0.5, send a maybe message
            if (random === 0.5) {
                message.reply(`I killed ${user.username} with a sword in the bathroom`);
            }
        } else {
            // if the message doesn't mention a user, kill a fictional user
            message.reply("I killed a fictional user with a knife in the kitchen");
        }
    }
});


// Login to Discord with your client's token
client.login(token).then(() => console.log("Logged in!"));