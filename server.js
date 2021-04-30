const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = parseInt(process.env.PORT) || 8080;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static(__dirname));

// modular routes
require('./routes/apiRoutes')(app);
require('./routes/viewRoutes')(app);

app.listen(PORT, () => console.log(`App listenng on port ${PORT}`))