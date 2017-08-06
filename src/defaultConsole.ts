import { warn, bind } from './private/utils';

const labels = {};

const oc = console;

// Exported for mocking in tests
export const defaultConsole = {
  profile: console.profile ? bind(console.profile, console) : () => {},
  profileEnd: console.profileEnd ? bind(console.profileEnd, console) : () => {},
  warn,

  time: console.time ? console.time.bind(console) : label => {
    labels[label] = new Date().valueOf();
  },
  timeEnd: console.timeEnd ? console.timeEnd.bind(console) : label => {
    const timeNow = new Date();
    const timeTaken = timeNow.valueOf() - (labels[label] as number);
    delete labels[label];
    console.log(`${label}: ${timeTaken}ms`);
  }
};

export default defaultConsole;
