import createElement from './vdom/createElement';
import render from './vdom/render';
import mount from './vdom/mount';

const createVApp = count => createElement('div', {
    attrs: {
        id: 'app',
        dataCount: count
    },
    children: [
        createElement('input'),
        'The current count is: ',
        String(count),
        createElement('img', {
            attrs: {
                src: 'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif'
            }
        })
    ]
});

let count = 0;

const vApp = createVApp(count);
const $app = render(vApp);
let $rootEl = mount($app, document.querySelector('#app'));

setInterval(() => {
    count++;
    $rootEl = mount(render(createVApp(count)), $rootEl);
}, 1000);
//console.log($app);