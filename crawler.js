const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');
const NOVEL_DIR = './novels'

let chapter = 133;

const crawl = async (url, title) => {
    try{
        const HTML = await axios.get(url);
        const $ = cheerio.load(HTML.data);
        let chapterContent = '';
        // console.log($('p')[20].children[0].data)
        $('p').each((i, e) => {
            if(e.children[0]){
                let txt = e.children[0]['data'];
                if(txt !== undefined && txt !== 'undefined'){
                    chapterContent += txt + '\n';
                }
            }
            // console.log(txt)
        });
        // console.log(chapterContent)
        await fs.writeFileSync(`${NOVEL_DIR}/${title}/chapter-${chapter}.txt`, chapterContent);
        let nextChapterLink = $('.nav-next')[0].children[0].attribs.href
        chapter++;
        await(delay(5000));
        if(nextChapterLink && chapter < 1260){
            crawl(nextChapterLink, title);
            console.log(nextChapterLink)
        }
    }catch(err){
        console.log(err)
    }
}

const delay = ms => {
    return new Promise((res) => {
        setTimeout(() => {
            res('OK')
        }, ms)
    })
}

let title = 'the-protector';
let firstChap = 'https://chapternovel.com/the-protector-chapter-134/';
crawl(firstChap, title);