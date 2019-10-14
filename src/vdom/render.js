const renderElement = ({tagName, attrs, children}) => {
    const $el = document.createElement(tagName);

    for(const [key, value] of Object.entries(attrs)) {
        $el.setAttribute(key, value);
    }

    for(const child of children) {
        $el.appendChild(render(child));
    }

    return $el;
};

const render = (vNode) => {
   if(typeof vNode === 'string') {
       return document.createTextNode(vNode);
   }

   return renderElement(vNode);
};

export default render;