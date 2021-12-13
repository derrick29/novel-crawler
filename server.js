const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const NOVEL_DIR = './novels'

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to test novel API');
});

app.get('/novels', async (req, res) => {
    let novels = await fs.readdirSync(`${NOVEL_DIR}`);
    res.send(novels);
})

app.get('/:title/chapters', async(req, res) => {
    let chaps = await fs.readdirSync(`${NOVEL_DIR}/${req.params.title}`);
    let sortedChaps = chaps.map(e => e.split('.')[0]).sort((a, b) => {
        return parseFloat(a.split('-')[1]) - parseFloat(b.split('-')[1]);
    })
    res.send(sortedChaps);
});

app.get('/:title/chapters/:chapter', async (req, res) => {
    let chapterContent = await fs.readFileSync(`${NOVEL_DIR}/${req.params.title}/${req.params.chapter}.txt`);
    res.send(chapterContent);
});

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});