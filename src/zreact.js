function createElement(type, props = {}, ...children) {
    console.log('%c [ children ]-2', 'font-size:13px; background:pink; color:#bf2c9f;', children)
    return {
        type,
        props: {
            ...props,
            type,
            children: children.map(child => typeof child === 'object' ? child : createTextElement(child))
        }
    }

}

function createTextElement(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}


function render(element, container) {
    if (typeof element.type === 'function') {
        element = element.type(element.props)
    }

    const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type)
    const isProperty = (p) => p !== 'children'

    Object.keys(element.props).filter(isProperty).forEach(key => {
        dom[key] = element.props[key]
    })
    
    element.props.children.forEach(child => render(child, dom))

    container.appendChild(dom)

}


export default {
    createElement,
    render,
};

