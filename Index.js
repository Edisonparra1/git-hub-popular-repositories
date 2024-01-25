const express = require('express');
const axios = require('axios');
const cors = require('cors');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 9000;

// conexion con  puerto react

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));

app.use(cookieParser());
app.use(csurf({ cookie: true }));

//solitud con axios api github metodo get

app.get('/', csurf({ cookie: true }), async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/users/google/repos?sort=stars');
    const popularRepos = response.data.slice(0, 10);

    const repoList = popularRepos.map(repo => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
    }));

    //opcion para luego implemntar autenticacion y manejo de rrores

    res.cookie('XSRF-TOKEN', req.csrfToken());

    res.json({ csrfToken: req.csrfToken(), repoList });
  } catch (error) {
    console.error('Error al obtener los repositorios:', error);
    res.status(500).json({ error: 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.' });
  }
});

    //llamado al puero por  la app

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
