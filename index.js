// Require the necessary discord.js classes
import discordJs from "discord.js";
import data from './config.json' assert {type: "json"};
import axios from 'axios';

const url = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/"
const token = data.token;
const app_id = data.app_id;
let currency = data.current_currency;
const delay = data.delay_in_seconds;
// Create a new client instance
const client = new discordJs.Client({
    intents: [discordJs.GatewayIntentBits.Guilds]
});
const guild_id = data.guild_id;
const dummy = [];
// Login to Discord with your client's token
client.login(token).then(() => console.log("Logged in!"));
client.on('ready', () => {
    console.log(`API Delay is ${delay} seconds`);
    // register dummy
    const exchangeConfigs = data.exchange;
    for (const exchangeConfig of exchangeConfigs) {
        const dummyClient = new discordJs.Client({
            intents: [discordJs.GatewayIntentBits.Guilds]
        });
        const target = exchangeConfig.currency;
        dummyClient.login(exchangeConfig.token).then(async function () {
            const guild = await dummyClient.guilds.fetch(guild_id);
            console.log(`${dummyClient.user.tag} is listening!`);
            dummy[target] = {};
            dummy[target]['client'] = dummyClient;
            dummy[target]['guild'] = guild;
            dummy[target]['toFixed'] = exchangeConfig.toFixed;
        });
    }
    // register interval
    setInterval(getExchangeRate, 1000 * delay);
});

function getExchangeRate() {
    for (let [key, clientData] of Object.entries(dummy)) {
        const dummyClient = clientData['client'];
        const guild = clientData['guild'];
        const toFixed = clientData['toFixed'];
        let formatUrl = `${url}${currency.toLowerCase()}/${key.toLowerCase()}.json`;
        try {
            axios.get(formatUrl).then(async function (response) {
                let rate = response.data[key.toLowerCase()];
                rate = parseFloat(rate).toFixed(toFixed)
                const name = `${currency} = ${rate} ${key}`;
                guild.members.fetch(dummyClient.user.id).then(function (member) {
                    member.setNickname(name).then(function () {
                        console.log(new Date().toLocaleTimeString() + ": Name updated to " + name);
                    });
                })
            }).catch(function (error) {
                console.log(error);
            });
        } catch (e) {
            console.log(e);
        }
    }
}