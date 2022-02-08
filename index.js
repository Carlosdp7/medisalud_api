require('./src/db/mongoose');
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes/index');
const { obtainTests } = require('./src/controllers/test');
const app = express();
const port = process.env.PORT;

//Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());

//Routes
app.get('/api/verification', (req, res) => {
  res.send({
    msg: 'ok'
  });
});

app.use(routes);

app.get('/', obtainTests);

app.all('*', (req, res) => {
  res.status(404).send({
    err: 'Route Not Found'
  })
})

//Listen
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
})