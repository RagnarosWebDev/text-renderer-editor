import {ANode, ImageNode, TextNode, VDomRenderer} from "text-renderer/lib";

const input = document.querySelector<HTMLDivElement>('#input')!
let currentVNodeId: number = 1;

const currentFocused = () => {
    return document.querySelector(`[data-id="${currentVNodeId}"]`)!
};
const getAttrId = (node: Element) => {
    return Number(node.attributes.getNamedItem('data-id')?.value)
}

const select = (nodeId: number) => {
    const f = currentFocused();
    f && currentFocused().classList.remove('focused')
    currentVNodeId = nodeId;
    currentFocused().classList.add('focused')
}

const onNodeMount = (_: Element) => {}

const renderer = new VDomRenderer([
    new ANode([
        new TextNode('asd')
    ], 'https://google.com'),
    new ANode([
        new ImageNode('https://api.arch.frontservice.ru/images/1706463030622-0.18941834695125204.png', 'asdasd'),
        new TextNode('asd123')
    ], 'https://google.com'),
], input, onNodeMount,
    (_, nextSelectedId) => {
    if (renderer.findNodeById(currentVNodeId)) {
        return
    }

    if (!nextSelectedId) return;
    currentVNodeId = nextSelectedId;
    select(nextSelectedId)
});


renderer.render()

document.querySelector('#text')!.addEventListener('click', () => {
    const id = getAttrId(currentFocused())

    renderer.insertAfter(new TextNode("asd"), id)
})

document.querySelector('#show')!.addEventListener('click', () => {
    console.log(renderer.nodes)
})

input.addEventListener('input', (e) => {
    renderer.patchTextNodes(currentVNodeId)
})
input.addEventListener('keypress', (e) => {
    if (e.code == "Enter") {
        const selection = window.getSelection();

        console.log(selection!.getRangeAt(0))

        return false;
    }
})
document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();

    if (selection!.anchorNode instanceof Element && selection!.anchorNode.parentElement == input) {
        select(getAttrId(selection!.anchorNode))
        return
    }

    let parentElement = selection!.anchorNode!.parentElement;
    while (parentElement!.parentElement != input) {
        parentElement = parentElement!.parentElement;
    }

    select(getAttrId(parentElement!));
})