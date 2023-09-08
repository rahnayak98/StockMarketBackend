const express = require('express');
const app = express();
const PORT = 3001;
const db = require('./models');
const signuprouter = require('./Routes/signup');
const signinrouter = require('./Routes/Signin');
const createstock = require('./Routes/Createstock');
const busellstock = require('./Routes/BuysellStock');
const getstocks = require('./Routes/GetAllStocks');
const topup = require('./Routes/TopUp');
const markettime = require('./Routes/Createmarkettime');
//Routes
app.use(express.json());
app.use('/auth', signuprouter);
app.use('/login', signinrouter);
app.use('/create', createstock);
app.use('/trans', busellstock);
app.use('/stock', getstocks);
app.use('/topup', topup);
app.use('/time', markettime);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log('API RUNNING');
  });
});
