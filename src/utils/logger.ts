import { OutputChannel, window } from 'vscode';

export const outputChannel: OutputChannel = window.createOutputChannel('NgrxUml');


export class Logger {

    log(value: any, ...optionalParams: any[]): void {

        if(optionalParams.length){ 
            outputChannel.appendLine(`${value} ${optionalParams.join(' ')}`);
            console.log( value, optionalParams);
        } else {
            outputChannel.appendLine(value);
            console.log('log:', value);
        }

    }
}

const logger = new Logger();
export default logger;