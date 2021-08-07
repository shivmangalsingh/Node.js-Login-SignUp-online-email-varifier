const express = require('express');
const { router } = require('./router.js');
const { config } = require('dotenv');
config();
const app = express();
app.use('/', router);
app.listen(process.env.PORT, () => {
    console.log(`Server is Listening at PORT ${process.env.PORT}`);
})