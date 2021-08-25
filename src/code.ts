import { MARKDOW } from "./data";

let SELECT_MARKDOWN = "";
let LAST_SELECT_TEXT: TextNode;

figma.showUI(__html__, { width: 400, height: 400 });

figma.ui.onmessage = msg => {
    SELECT_MARKDOWN = msg.select;
    render();
}

figma.on("selectionchange", () => {
    render();
});

function render() {
    let currentNode = figma.currentPage.selection[0];
    let textNode: TextNode;

    if (currentNode != undefined) {
        switch (currentNode.type) {
            case "GROUP":
                let groupNode = <GroupNode>currentNode;
                textNode = <TextNode>groupNode.findOne(node => node.type === "TEXT");
                break;
            case "INSTANCE":
                let instanceNode = <InstanceNode>currentNode;
                textNode = <TextNode>instanceNode.findOne(node => node.type === "TEXT");
                break;
            case "TEXT":
            default:
                textNode = <TextNode>currentNode;
                break;
        }
        LAST_SELECT_TEXT = textNode;
    }
    let text = LAST_SELECT_TEXT? markText(LAST_SELECT_TEXT): "";
    figma.ui.postMessage({ text });
}

function markText(textNode: TextNode): string {
    const bold = new RegExp(".*(bold|black).*", "gi");
    const italic = new RegExp(".*(light|italic).*", "gi");
    const markdown = MARKDOW[SELECT_MARKDOWN];

    const len = textNode.characters.length;

    let text: string = "";

    for (let i = 0; i < len; i++) {
        let fn = (<FontName>textNode.getRangeFontName(i, i + 1)).style;
        let ch = textNode.characters[i];

        let boldMatch = fn.match(bold);
        let italicMatch = fn.match(italic);
        let isEndOfLine = ch.charCodeAt(0) == 10;

        if (boldMatch && italicMatch && !isEndOfLine) text += markdown.iS + markdown.bS + ch + markdown.bE + markdown.iE;
        else if (boldMatch && !isEndOfLine) text += markdown.bS + ch + markdown.bE;
        else if (italicMatch && !isEndOfLine) text += markdown.iS + ch + markdown.iE;
        else text += ch;
    }

    if (SELECT_MARKDOWN != "") {
        text = text.replace(new RegExp(`\\${markdown.iS}( *)\\${markdown.iE}`, 'gim'), "$1");
        text = text.replace(new RegExp(`\\${markdown.bS}( *)\\${markdown.bE}`, 'gim'), "$1");
        text = text.replace(new RegExp(`\\${markdown.iE}( *)\\${markdown.iS}`, 'gim'), "$1");
        text = text.replace(new RegExp(`\\${markdown.bE}( *)\\${markdown.bS}`, 'gim'), "$1");
        text = text.replace(new RegExp(`\\${markdown.iS}( *)(.+?)( *)\\${markdown.iE}`, 'gim'), `$1${markdown.iS}$2${markdown.iE}$3`);
        text = text.replace(new RegExp(`\\${markdown.bS}( *)(.+?)( *)\\${markdown.bE}`, 'gim'), `$1${markdown.bS}$2${markdown.bE}$3`);
    }
    return text;
}



