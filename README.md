# ChatbotMarkdown

What is it?
------------
This plugin, provides an **automate formatting process of texts** components on Figma, converting sentences written with **italics or bold** to costumized markup notations for developers.

Currently this plugin allows *three types of configurations*:

💬 **WhatsApp** \
&ensp;&ensp;👉  Italic: \_some text\_  \
&ensp;&ensp;👉  Bold: \*some text\*   

💬 **HTML** \
&ensp;&ensp;👉 Italic: \<i>some text\</i> \
&ensp;&ensp;👉 Bold: \<b>some text\</b>

💬 **Variable** \
&ensp;&ensp;👉 Italic: {{iS}}some text{{iE}} \
&ensp;&ensp;👉 Bold: {{bS}}some text{{bE}}

It's was built with React using figma template code: https://github.com/figma/plugin-samples

Benefits
------------
✔️ Less time consumption \
✔️ Less chance of putting a wrong markup


How to install
------------
Anyone can browse the Figma Community. \
All you'll need is a Figma account to install the plugin.

**1.** Access the site: https://www.figma.com/community \
**2.** In the search area type "Chatbot Markup" \
**3.** Click to install \
**4.** Click ❤️ to like the plugin

or 

Access with the link: https://www.figma.com/community/plugin/954531586394206516/Chatbot-Markup


How to use
------------
**1.** Open the project \
**2.** Right-click anywhere on the canvas. \
**3.** Hover over Plugins in the menu \
**4.** Select the plugin "Chatbot Markup" \
**5.** With the UI open, click on any text element with italics or bold and watch the markup occur. 

⚠️ _Plugins only run in the editor mode (so if you only have view permission duplicate the project to your drafts and run on the created copy)_ \
⚠️ _Plugins can't run in the background._ \
⚠️ _You can only run one plugin at a time._

How it works
------------
Each figma font/typefaces has a set of weight that can be apply, such as regular, bold, italic, thin, black, etc. \
Some typefaces have no style option, and sometimes only offer a regular weight. \
In this plugin, the following types of weight and their variations were considered: \
👉 Light (as Italic) \
👉 Italic (as Italic) \
👉 Regular \
👉 Bold (as Bold) \
👉 Black (as Bold)
