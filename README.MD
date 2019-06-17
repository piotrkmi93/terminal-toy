# Terminal Toy

![Terminal](https://raw.githubusercontent.com/piotrkmi93/terminal-toy/master/Terminal/example/terminal.png)

This is the simple terminal toy. It handles every javascript code (via eval) and it is possible to create Your own commands.

## Usage

Insert `css` and `js` files inside Your `index.html` by downloading `terminal.css` and `terminal.js` or use cdn:

```
<link href="https://raw.githubusercontent.com/piotrkmi93/terminal-toy/master/Terminal/terminal.css" rel="stylesheet" type="text/css">
```

```
<script src="https://raw.githubusercontent.com/piotrkmi93/terminal-toy/master/Terminal/terminal.js"></script>
```

Then in Your script file, create Terminal instance by:

```
const terminal = Terminal.start('terminal-id', 'Terminal Name');
```

or

```
const terminal = new Terminal('terminal-id', 'Terminal Name');
```

You can also provide third string attribute, which is prefix before command (conventional is `admin$: `).

## Create new commands

```
/**
 * @param command  string
 * @param callback function => string | string[]
 */
terminalInstance.on('commandName', (...attributes) => {
    // handle attributes and return response or responses
    return '';
});
```

Example:
```
terminal.on('greetings', (name) => {
    return `Hello, ${name}!`;
});
```

## Standard functionality

### JavaScript playground

Terminal handles JavaScript code so, here's few examples:

```
admin$: 2 + 2 * 2
6
admin$: Date.now()
1560812567806
admin$: Math.random()
0.9358324653545034
```

### History

Terminal saves every command You've enter in local history as an array. You can browse it using `Arrow Up` and `Arrow Down` keys. History is also stored in localStorage. 

### Clearing console

```
clear
```

This standard command will delete all previous lines from terminal but hold history.

```
clear all
```

This will clear console and history.

## Authors
* [Piotr Kmiecik](https://github.com/piotrkmi93)
