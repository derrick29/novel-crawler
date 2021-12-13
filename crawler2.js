const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');
const NOVEL_DIR = './novels'

let chapter = 1;
let incrementCount = 10;

const crawl = async (url, title, chapterNum) => {
    let tmpurl = url;
    url = `${url}-${chapterNum}`;
    console.log(`Downloading ${url}...`)
    try{
        const HTML = await axios.get(url);
        const $ = cheerio.load(HTML.data);
        let chapterContent = '';
        $('p').each((i, e) => {
            let cc = 0;
            for(const cn of e.childNodes){
                let txt = cn['nodeValue'];
                if(txt !== undefined && txt !== 'undefined' && txt !== null){
                    chapterContent += txt;
                    cc++;
                }
            }
            chapterContent += '\n\n';
        });
        await fs.writeFileSync(`${NOVEL_DIR}/${title}/chapter-${chapterNum}.txt`, chapterContent);
        let tmpChapter = chapter + incrementCount;
        let nextChapterNum = incrementCount > 1 ? (tmpChapter) + '-' + (tmpChapter+9) : tmpChapter + 1;
        let nextChapterLink = `${tmpurl}-${nextChapterNum}`
        await(delay(5000));
        if(await validateLink(nextChapterLink)){
            console.log(`Attempting... ${nextChapterLink}`);
            await crawl(tmpurl, title, nextChapterNum);
            chapter += incrementCount;
        }else{
            incrementCount = 1;
            nextChapterLink = `${tmpurl}-${tmpChapter+1}`;
            console.log(`Attempting... ${nextChapterLink}`);
            await crawl(tmpurl, title, tmpChapter+1);
            chapter++;
        }
    }catch(err){
        console.log(err)
    }
}

const validateLink = async (url) => {
    let isValid = false;
    try{
        await axios.get(url);
        isValid = true;
    }catch(err) {
    }
    return isValid;
}

const delay = ms => {
    return new Promise((res) => {
        setTimeout(() => {
            res('OK')
        }, ms)
    })
}

let title = 'charlie-wade';
let chapterNum = incrementCount > 1 ? chapter + '-' + (chapter+9) : chapter;

let novelUrl = `https://smnovels.com/novel/the-amazing-son-in-law-novel/chapter`;
crawl(novelUrl, title, chapterNum);