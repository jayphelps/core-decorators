import fs from 'fs';
import globalWrap from 'global-wrap';
 
globalWrap({
  main: 'lib/core-decorators.js',
  global: 'CoreDecorators',
  browserifyOptions: { detectGlobals: false }
}, (error, output) => {
  if (error) {
    console.error(error);
  } else {
    fs.writeFile('./core-decorators.js', output, error => {
      if (error) {
        console.error(error);
      } else {
        console.log('Bower build success');
      }
    });
  }
});