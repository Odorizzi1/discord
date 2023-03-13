const http = require('http');
const axios = require('axios');
const { Buffer } = require('buffer');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.UD_API_KEY;

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/cursos') {
    try {
      const authToken = `${clientId}:${clientSecret}`;
      const encodedToken = Buffer.from(authToken).toString('base64');

      const response = await axios.get(`https://www.udemy.com/api-2.0/courses/?search=&price=price-free,price-paid&price_currency=brl&fields[course]=@default,visible_instructors&ordering=-price&language=pt&skip_price=1&page=1&page_size=10`, {
        headers: {
          Authorization: `Basic ${encodedToken}`
        }
      });

      const courses = response.data.results;
      const filteredCourses = courses.filter((course) => course.price === 'Free');
      const courseData = filteredCourses.map((course) => {
        return {
          title: course.title,
          link: course.url,
          image: course.image_125_H
        }
      });
     console.log(courseData, "retorno")
    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Ocorreu um erro ao recuperar os cursos da Udemy.');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Página não encontrada.');
  }
});

server.listen(3001, () => {
  console.log('Servidor iniciado na porta 3001.');
});
