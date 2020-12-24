
figma.showUI(__html__, { width: 400, height: 400 });

interface TextFont {
  ch: string;
  fn: string
}

interface TextMarkdown {
  bS: string;
  bE: string
  iS: string;
  iE: string
}


const MARKDOWN: {[id: string] : TextMarkdown} = {
  "wa": {
    bS: "*",
    bE: "*",
    iS: "_",
    iE: "_"
  },
  "bc": {
    bS: "&lt;b&gt;",
    bE: "&lt;/b&gt;",
    iS: "&lt;i&gt;",
    iE: "&lt;/i&gt;"
  },
  "var": {
    bS: "{{bS}}",
    bE: "{{bE}}",
    iS: "{{iS}}",
    iE: "{{iE}}"
  }
}

let SELECT_MARKDOWN = "wa";

const markText = (textFont: TextFont[]) => {
  const bold = new RegExp(".*(bold|black).*", "gi");
  const italic = new RegExp(".*(light|italic).*", "gi");

  const markdown = MARKDOWN[SELECT_MARKDOWN];
  let text: string = "";

  textFont.forEach(t => {
    const boldMatch = t.fn.match(bold);
    const italicMatch = t.fn.match(italic);

    if (boldMatch) text += markdown.bS + t.ch + markdown.bE;
    else if (italicMatch) text += markdown.iS + t.ch + markdown.iE;
    else text += t.ch;
  })

  text = text.replace(new RegExp(`\\${markdown.bS}( *)\\${markdown.bE}`, 'gim'), "$1");
  text = text.replace(new RegExp(`\\${markdown.iS}( *)\\${markdown.iE}`, 'gim'), "$1");

  text = text.replace(new RegExp(`\\${markdown.bS}( *)(.+?)( *)\\${markdown.bE}`, 'gim'), `$1${markdown.bS}$2${markdown.bE}$3`);
  text = text.replace(new RegExp(`\\${markdown.iS}( *)(.+?)( *)\\${markdown.iE}`, 'gim'), `$1${markdown.iS}$2${markdown.iE}$3`);

  text = text.replace(new RegExp(`\\${markdown.bE}( *)\\${markdown.bS}`, 'gim'), "$1");
  text = text.replace(new RegExp(`\\${markdown.iE}( *)\\${markdown.iS}`, 'gim'), "$1");
  return text;
}

const setTextOnUI = (textNode: TextNode) => {
  const len = textNode.characters.length;
  let textFont = []
  for (let i = 0; i < len; i++) {
    let fn = (<FontName>textNode.getRangeFontName(i, i + 1)).style;
    let ch = textNode.characters[i];
    textFont.push(<TextFont>{ ch, fn })
  }
  const text = markText(textFont);
  figma.ui.postMessage({ text });
}

const renderSelection = () => {
  let currentNode = figma.currentPage.selection[0];
  let textNode: TextNode;

  if (currentNode != undefined) {
    switch (currentNode.type) {
      case "GROUP":
        let groupNode = <GroupNode>currentNode;
        textNode = <TextNode>groupNode.findOne(node => node.type === "TEXT");
        setTextOnUI(textNode);
        break;
      case "INSTANCE":
        let instanceNode = <InstanceNode>currentNode;
        textNode = <TextNode>instanceNode.findOne(node => node.type === "TEXT");
        setTextOnUI(textNode);
        break;
      case "TEXT":
        textNode = <TextNode>currentNode;
        setTextOnUI(textNode);
        break;
    }
  }
}

figma.ui.onmessage = msg => {
  SELECT_MARKDOWN = msg.select;
  renderSelection();
}


figma.on('selectionchange', () => {
  renderSelection();
});

