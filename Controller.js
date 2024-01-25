const axios = require('axios');
const cors = require('cors');
const csurf = require('csurf');

// Configuración CORS
const corsOptions = {
  origin: 'http://tu-dominio-permitido.com',
  optionsSuccessStatus: 200,
};

// Configuración csurf
const csrfProtection = csurf({ cookie: true });

async function getPopularRepos(req, res) {
  try {
    // Obtener la lista de repositorios más populares del usuario "google" desde la API de GitHub
    const response = await axios.get('https://api.github.com/users/google/repos?sort=stars');
    const popularRepos = response.data.slice(0, 10);

    // Muestra la información de los 10 repositorios más populares
    const repoList = popularRepos.map(repo => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
    }));

    // Agrega el token CSRF a la respuesta
    res.cookie('XSRF-TOKEN', req.csrfToken());

    res.json({ csrfToken: req.csrfToken(), repoList });
  } catch (error) {
    console.error('Error al obtener los repositorios:', error);

    // Devuelve un mensaje genérico al cliente 
    res.status(500).json({ error: 'Ha ocurrido un error al obtener los repositorios.' });
  }
}

module.exports = {
  getPopularRepos: cors(corsOptions, csrfProtection)(getPopularRepos), // Aplica CORS y CSRF al controlador
};
