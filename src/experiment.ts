import { ask } from '.';

ask.search('Test', async () => {
    return ['Test'];
}).then(result => {
    console.log(result);
});
