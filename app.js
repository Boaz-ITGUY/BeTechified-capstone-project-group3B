const dotenv = require('dotenv');

dotenv.config();
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3002;

app.get('/', (req, res) => {
    res.send('Hello Backend Developers. This is Group 3B. Welcome!')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
