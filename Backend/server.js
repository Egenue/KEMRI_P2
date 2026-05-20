const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.listen( PORT, () => {
    return console.log(`Server running on Port ${PORT}`);
});