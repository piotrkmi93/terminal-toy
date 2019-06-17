class Terminal {
    constructor(elementId, title, prefix = `admin$`) {
        try {
            prefix = prefix.trim() + ': ';

            this.element  = document.getElementById(elementId);
            this.content  = this.element.querySelector('.content');
            this.data     = this.content.querySelector('.data');
            this.prefix   = this.content.querySelector('.prefix');
            this.input    = this.content.querySelector('.input');

            this.lines    = [];
            this.history  = (localStorage.getItem(`terminal#${this.element.id}`) || '').split(',');
            this.commands = [];
            this.lastHistoryIndex = undefined;

            this.prefix.innerHTML  = prefix;
            this.element.querySelector('.bar-title').innerHTML = title;

            this.resize();
            this.onClick();
            this.onKeyUp();
            this.onResize();
        } catch (exception) {
            console.error(exception);
        }
    }

    static start(elementId, title, prefix) {
        return new Terminal(elementId, title, prefix);
    }

    static init() {
        [...document.querySelectorAll('.terminal')].forEach(terminal => terminal.innerHTML = '<div class="bar"><span class="bar-button close"></span><span class="bar-button minimize"></span><span class="bar-button maximize"></span><span class="bar-title"></span></div><div class="content"><span class="data"></span><p class="current"><span class="prefix"></span><input class="input"/></p></div>');
    }

    focus() {
        this.input.focus();
    }

    resize() {
        this.input.style.width = (this.content.clientWidth - this.prefix.offsetWidth - 19) + 'px';
    }

    execute(command) {
        command = command.trim();

        this.lastHistoryIndex = undefined;
        let responses = [];
        let notFound  = false;

        try {
            responses = [eval(command)];
        } catch (e) {
            let [name, ...attributes] = command.replace(/ +/g, ' ').split(' ');
            name = name.toLowerCase();

            if (name in this.commands) {
                const response = this.commands[name](...attributes);
                responses = Array.isArray(response)
                    ? response
                    : [response];
            } else {
                responses = [name + ' command not found'];
                notFound = true;
            }
        }

        this.push(command, responses, notFound);
    }

    push(command, responses = [], notFound = false) {
        this.history.push(command);
        localStorage.setItem(`terminal#${this.element.id}`, this.history);

        if (notFound) {
            responses = responses.map(response => `ERROR#${response}`);
        }


        if (command.toLowerCase().startsWith('clear')) {
            this.lines = [];
            this.data.innerHTML = '';

            if (command.toLowerCase().endsWith('all')) {
                this.history = [];
                localStorage.removeItem(`terminal#${this.element.id}`);
            }
        } else {
            this.lines.push(this.prefix.innerHTML + command + this.getDate(), ...responses);
            this.data.innerHTML = this.lines.map(line => {

                try {
                    line = line.toString();
                } catch (e) {
                    return line;
                }

                let p = '<p';
                if (line.startsWith('ERROR#')) {
                    p += ' style="color:rgb(255, 64, 58);"';
                    line = line.replace('ERROR#', '');
                }
                return p + `">${line}</p>`;
            }).join('');
        }

        this.input.value = '';
    }

    getDate() {
        const now    = new Date();
        const values = [
            now.getDate(), now.getMonth() + 1, now.getFullYear(), now.getHours(), now.getMinutes(), now.getSeconds()
        ].map(value => value.toString().length < 2 ? '0' + value : value);
        return `<span style="float:right;color:#424242;">[${values.splice(0, 3).join('.')} ${values.join(':')}]</span>`;
    }

    on(command, callback) {
        if (typeof command === 'string' && typeof callback === 'function') {
            this.commands[command.toLowerCase()] = callback;
        }
    }

    onClick() {
        const terminal = this;

        this.content.addEventListener('click', function () {
            terminal.focus();
        });
    }

    onKeyUp() {
        const terminal = this;

        this.content.addEventListener('keyup', function (event) {
            event.preventDefault();
            const key = event.key || event.code;
            let index;

            switch (key) {
                case 'Enter':
                    terminal.execute(terminal.input.value);
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                    const operation = key === 'ArrowUp' ? '-' : '+';
                    index = typeof terminal.lastHistoryIndex === 'number'
                          ? eval(`terminal.lastHistoryIndex ${operation} 1`)
                          : eval(`terminal.history.length   ${operation} 1`);

                    if (terminal.history.length && terminal.history[index]) {
                        terminal.lastHistoryIndex = index;
                        terminal.input.value = terminal.history[index];
                    } else if (index > 0) {
                        terminal.lastHistoryIndex = undefined;
                        terminal.input.value = '';
                    }

                    break;
                default:
                    // empty
            }
        });
    }

    onResize() {
        const terminal = this;

        window.addEventListener('resize', function () {
            terminal.resize();
        });
    }
}

Terminal.init();
