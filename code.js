figma.showUI(__html__, { width: 400, height: 400 });
const MARKDOWN = {
    "wa": {
        bS: "*",
        bE: "*",
        iS: "_",
        iE: "_"
    },
    "bc": {
        bS: "<b>",
        bE: "</b>",
        iS: "<i>",
        iE: "</i>"
    },
    "var": {
        bS: "{{bS}}",
        bE: "{{bE}}",
        iS: "{{iS}}",
        iE: "{{iE}}"
    }
};
let SELECT_MARKDOWN = "wa";
const markText = (textFont) => {
    const bold = new RegExp(".*(bold|black).*", "gi");
    const italic = new RegExp(".*(light|italic).*", "gi");
    const markdown = MARKDOWN[SELECT_MARKDOWN];
    let text = "";
    textFont.forEach(t => {
        const boldMatch = t.fn.match(bold);
        const italicMatch = t.fn.match(italic);
        const isEndOfLine = t.ch.charCodeAt(0) == 10;
        if (boldMatch && italicMatch && !isEndOfLine)
            text += markdown.iS + markdown.bS + t.ch + markdown.bE + markdown.iE;
        else if (boldMatch && !isEndOfLine)
            text += markdown.bS + t.ch + markdown.bE;
        else if (italicMatch && !isEndOfLine)
            text += markdown.iS + t.ch + markdown.iE;
        else
            text += t.ch;
    });
    text = text.replace(new RegExp(`\\${markdown.iS}( *)\\${markdown.iE}`, 'gim'), "$1");
    text = text.replace(new RegExp(`\\${markdown.bS}( *)\\${markdown.bE}`, 'gim'), "$1");
    text = text.replace(new RegExp(`\\${markdown.iE}( *)\\${markdown.iS}`, 'gim'), "$1");
    text = text.replace(new RegExp(`\\${markdown.bE}( *)\\${markdown.bS}`, 'gim'), "$1");
    text = text.replace(new RegExp(`\\${markdown.iS}( *)(.+?)( *)\\${markdown.iE}`, 'gim'), `$1${markdown.iS}$2${markdown.iE}$3`);
    text = text.replace(new RegExp(`\\${markdown.bS}( *)(.+?)( *)\\${markdown.bE}`, 'gim'), `$1${markdown.bS}$2${markdown.bE}$3`);
    return text;
};
const setTextOnUI = (textNode) => {
    const len = textNode.characters.length;
    let textFont = [];
    for (let i = 0; i < len; i++) {
        let fn = textNode.getRangeFontName(i, i + 1).style;
        let ch = textNode.characters[i];
        textFont.push({ ch, fn });
    }
    const text = markText(textFont);
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
