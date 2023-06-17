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
        dummyClient.login(exchangeConfig.token).then(function () {
            console.log(`${dummyClient.user.tag} is listening!`);
            dummy[target] = dummyClient;
        });
    }
    // register interval
    setInterval(getExchangeRate, 1000 * delay);
});

function getExchangeRate() {
    for (let [key, dummyClient] of Object.entries(dummy)) {
        let formatUrl = `${url}${currency.toLowerCase()}/${key.toLowerCase()}.json`;
        axios.get(formatUrl).then(function (response) {
            let rate = response.data[key];
            rate = parseFloat(rate).toFixed(4)
            dummyClient.user.setUsername(`${currency} = ${key} ${rate}`);
        })
    }
}