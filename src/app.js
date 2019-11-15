const { takeScreenshot } = require('./lib/screenshot/capture')

takeScreenshot('http://www.google.com').catch((e) => { console.log(e) }).finally(() => { console.log('done') })
