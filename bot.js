// const { Client, Intents } = require('discord.js');
require('dotenv').config();
const axios = require('axios');
const { Buffer } = require('buffer');

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ]
})

client.on('ready', () => {
  console.log(`Bot iniciado como ${client.user.tag}!`);

  client.user.setActivity({
    name:"testando"
  })
});

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.UD_API_KEY;

const prefix = "!"; // Prefixo definido como "!"

client.on('message', async (message) => {
  if (message.content.startsWith(prefix)) {
    const command = message.content.slice(prefix.length).trim().toLowerCase();

    if (command === "cursos") {
      try {
        const authToken = `${clientId}:${clientSecret}`;
        const encodedToken = Buffer.from(authToken).toString('base64');

        const response = await axios.get(`https://www.udemy.com/api-2.0/courses/?search=&price=price-free,price-paid&price_currency=brl&fields[course]=@default,visible_instructors&ordering=-price&price__lte=50&language=pt&skip_price=1&page=1&page_size=10`, {
          headers: {
            Authorization: `Basic ${encodedToken}`
          }
        });

        const courses = response.data.results;
        const filteredCourses = courses.filter((course) => course.price.amount < 50);
        const courseTitles = filteredCourses.map((course) => course.title);

        message.channel.send(`Cursos abaixo de 50 reais:\n\n${courseTitles.join('\n')}`);
      } catch (error) {
        console.error(error);
        message.channel.send('Ocorreu um erro ao recuperar os cursos da Udemy.');
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

