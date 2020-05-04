import { OutputChannel, window } from 'vscode';

export const outputChannel: OutputChannel = window.createOutputChannel('NgrxUml');


export class Logger {

    log(value: any) {
        outputChannel.appendLine(value);
        console.log('log', value);
    }
}

const logger = new Logger();
export default logger;