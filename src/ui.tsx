import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Box, Button, FormGroup, Grid, MenuItem, Select, TextField } from '../node_modules/@material-ui/core/index';
import './ui.css';
import { MARKDOW } from "./data";

declare function require(path: string): any

class App extends React.Component {

  state = { text: ""}
  textArea: HTMLTextAreaElement;

  componentDidMount() {
    window.onmessage = (msg: any) => {
      this.setState({ text: msg.data.pluginMessage.text });
    };
  }

  onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ isVariableSelect: false });
    parent.postMessage({ pluginMessage: { select: event.target.value } }, '*');
  }

  onCopy = () => {
    this.textArea.select();
    document.execCommand('copy');
  }

  render() {
    return <>
      <select id="select" onChange={this.onChange}>
        {Object.keys(MARKDOW).map((channel) =>
          <option value={channel} key={channel}>{MARKDOW[channel].option}</option>)
        }
      </select>

      <textarea readOnly id="text" 
        placeholder="Clique em algum elemento com texto!"
        value={this.state.text}
        ref={(textarea: HTMLTextAreaElement) => this.textArea = textarea}></textarea>

      <button id="btn" onClick={this.onCopy}>Copiar</button>
    </>
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'))
