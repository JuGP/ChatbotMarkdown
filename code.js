figma.showUI(__html__, { width: 400, height: 400 });
let SELECT_MARKDOWN = "wa";
const MARKDOWN = {
    "wa": {
        boldStartTag: "*",
        boldEndTag: "*",
        italicStartTag: "_",
        italicEndTag: "_"
    },
    "bc": {
        boldStartTag: "&lt;b&gt;",
        boldEndTag: "&lt;/b&gt;",
        italicStartTag: "&lt;i&gt;",
        italicEndTag: "&lt;/i&gt;"
    }
};
const groupSequenceBy = (textFont) => {
    const bold = new RegExp(".*(bold|black).*", "gi");
    const italic = new RegExp(".*(light|italic).*", "gi");
    const markdown = MARKDOWN[SELECT_MARKDOWN];
    let isBold = false;
    let isItalic = false;
    let text = "";
    textFont.forEach(t => {
        const boldMatch = t.fn.match(bold);
        const italicMatch = t.fn.match(italic);
        if (!isBold && boldMatch) {
            text += markdown.boldStartTag;
            isBold = true;
        }
        if (!isItalic && italicMatch) {
            text += markdown.italicStartTag;
            isItalic = true;
        }
        if (isItalic && !italicMatch) {
            text += markdown.italicEndTag;
            isItalic = false;
        }
        if (isBold && !boldMatch) {
            text += markdown.boldEndTag;
            isBold = false;
        }
        text += t.ch;
    });
    text += isItalic ? markdown.italicEndTag : "";
    text += isBold ? markdown.boldEndTag : "";
    text = text.replace(new RegExp(`\\${markdown.boldStartTag}(\\s*)(.+?)(\\s*)\\${markdown.boldEndTag}`, 'gim'), `$1${markdown.boldStartTag}$2${markdown.boldEndTag}$3`);
    text = text.replace(new RegExp(`\\${markdown.italicStartTag}(\\s*)(.+?)(\\s*)\\${markdown.italicEndTag}`, 'gim'), `$1${markdown.italicStartTag}$2${markdown.italicEndTag}$3`);
    text = text.replace(new RegExp(`\\${markdown.boldEndTag}(\\s+)\\${markdown.boldStartTag}`, 'gim'), "$1");
    text = text.replace(new RegExp(`\\${markdown.italicEndTag}(\\s+)\\${markdown.italicStartTag}`, 'gim'), "$1");
    text = text.replace(new RegExp(`\\${markdown.boldStartTag}(\\s+)\\${markdown.boldEndTag}`, 'gim'), "$1");
    text = text.replace(new RegExp(`\\${markdown.italicStartTag}(\\s+)\\${markdown.italicEndTag}`, 'gim'), "$1");
    return text;
};
const setTextOnUI = (textNode) => {
    const len = textNode.characters.length;
    let textFont = [];
    for (let i = 0; i < len; i++) {
        let fn = textNode.getRangeFontName(i, i + 1).style;
        let ch = textNode.characters[i];
        textFont.push({ "ch": ch, "fn": fn });
    }
    const text = groupSequenceBy(textFont);
    figma.ui.postMessage({ text });
};
const renderSelection = () => {
    let currentNode = figma.currentPage.selection[0];
    let textNode;
    if (currentNode != undefined) {
        switch (currentNode.type) {
            case "GROUP":
                let groupNode = currentNode;
                textNode = groupNode.findOne(node => node.type === "TEXT");
                setTextOnUI(textNode);
                break;
            case "INSTANCE":
                let instanceNode = currentNode;
                textNode = instanceNode.findOne(node => node.type === "TEXT");
                setTextOnUI(textNode);
                break;
            case "TEXT":
                textNode = currentNode;
                setTextOnUI(textNode);
                break;
        }
    }
};
figma.ui.onmessage = msg => {
    SELECT_MARKDOWN = msg.select;
    renderSelection();
};
figma.on('selectionchange', () => {
    renderSelection();
});
