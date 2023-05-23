const puppeteer = require('puppeteer');
const readline = require('readline');
const { testConfig } = require('./modules/racecondition/testsConfig.js');
const { EventEmitter } = require("node:events");

class MyEmitter extends EventEmitter { };
const myEmitter = new MyEmitter();


function ask(query) {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
    if (query == 'Submit form? ' && ans === 'Yes') {
      myEmitter.emit('formSubmit');
    }
    if (query == 'End? ' && ans === 'Yes') {
      myEmitter.emit('end');
    }
  }))
}

async function tabs() {
  let pages = {};
  const product = await ask("Which product are we testing? :");
  if (!testConfig[product]) {
    console.log('config does not exist');
    return;
  }
  const config = testConfig[product];
  const browser = await puppeteer.launch({
    headless: false
  });

  if (config.sessions > 0) {
    for (let s = 0; s < config.sessions; s++) {
      pages[s] = await browser.newPage();
      await pages[s].goto(config.url);
      //Fill out widgets
      if (!!config.widgets) {
        const widgets = Object.entries(config.widgets);
        for (const [iframe, fields] of widgets) {
          for (const [field, val] of Object.entries(fields)) {
            let elem = await pages[s].mainFrame().waitForSelector(`#${iframe}`);
            let frame = await elem.contentFrame();
            await frame.select(`[id='${field}']`, val);
          }
        }
      }

      //Wait for submit command
      myEmitter.on('formSubmit', () => {
        pages[s].waitForNavigation({ timeout: 0 })
        pages[s].click(`#${config.submitBtnID}`);
      });
      //close
      myEmitter.on('end', () => {
        pages[s].close();
      });
    }
  } else { return };

  await ask('Submit form? ');
  await ask('End? ');

};


tabs();