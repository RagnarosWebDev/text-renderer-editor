import {ANode, ImageNode, TextNode, VDomRenderer, VNode, VSerializer} from "text-renderer/lib";

/*const input = document.querySelector<HTMLDivElement>('#input')!
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
        const vNode = renderer.insertAfter(new TextNode("asd"), currentVNodeId);
        select(vNode.id);
        e.preventDefault()
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
})*/


const serializer = new VSerializer();
serializer.addType("link", (data, childRender) => {
    if (!data.link) {
        throw new Error("node has not attribute link")
    }

    return new ANode((data.children ?? []).map((e: any) => childRender(e)), data.link);
})
serializer.addType("image", (data, _) => {
    if (!data.src) {
        throw new Error("node has not attribute src")
    }

    return new ImageNode(data.src, data.alt ?? '');
})

serializer.addType("text", (data, _) => {
    if (!data.text) {
        throw new Error("node has not attribute text")
    }

    return new TextNode(data.text);
})

const nodes: VNode[] = [
    new ANode([
        new ImageNode("https://api.arch.frontservice.ru/images/1706502730868-0.05528364905001748.png", ""),
        new TextNode("asd")
    ], "https://google.com"),
    new TextNode("asd")
]

const input = document.querySelector<HTMLDivElement>('#input')!
const renderer = new VDomRenderer(serializer.serialize(JSON.stringify(nodes)), input);
renderer.render();