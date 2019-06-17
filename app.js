const terminal = Terminal.start('terminal', 'Terminal');

terminal.on('greetings', (name) => {
    return `Hello, ${name}!`;
});
