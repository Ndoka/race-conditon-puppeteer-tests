# Race condition puppeteer tests
**Steps to add and use test **
1. `npm i`
2. Add config to `modules/racecondition/testConfig.json`

```js
"oldsubmissioncounter": {
    "url": "https://www.jotformers.com/231211490869053", //form url
    "sessions": "10", // how many browsesr tabs to open
    "submitBtnID": "input_2", // id selector for submit button
    "widgets": null //must be null if you do not want puppeteer to set the widget value
  }
  ```
  3. To start test, run `node .`
  4. When prompted 'Which product are we testing? ' - respond with the name of the config you entered in `testConfig.json`. For example, for the config in step 2 above, enter `oldsubmissioncounter`.
  5. When all the tabs have loded, you can answer 'Yes'  the prompt to submit all the forms. 
  6. After making your observation (for example, a validation message on the form submit page), you can close the test by responding 'Yes' to the final prompt. 
