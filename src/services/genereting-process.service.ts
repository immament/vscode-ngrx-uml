import { ChildProcess, fork } from 'child_process';
import { GeneratorOptions } from 'ngrx-uml';
import path from 'path';
import { Subject } from 'rxjs';

import logger from '../utils/logger';

export class GeneretingProcessService {

    private readonly createDiagramProcessFile = 'create-diagram-process.js';

    private diagramProcess: ChildProcess;
    private progressSubject = new Subject<string>();
    public progress = this.progressSubject.asObservable();

    constructor(
        private readonly options: GeneratorOptions,
        private readonly includeFiles: string,
        private readonly resolve: (value?: unknown) => void,
        private readonly reject: (reason?: unknown) => void

    ) {
        this.diagramProcess = this.createDiagramProcess();
    }

    run() {
        this.sendRunMsg(this.options);
    }

    cancel() {
        if (this.diagramProcess) {
            this.diagramProcess.kill();
        }
    }

    private createDiagramProcess(): ChildProcess {
        const diagramProcessFilePath = this.createDiagramProcessFilePath();
        const diagramProcess: ChildProcess = fork(diagramProcessFilePath, [], {
            silent: true,
            detached: true
        })
            .on('error', (err) => logger.log(`\n\t\tERROR: fork process failed! (${err})`))
            .on('message', (msg: {
                error: string;
            } | any) => this.onProcessMesssage(msg))
            .on('exit', (code, signal) => this.onProcessExit(code, signal, this.resolve))
            .on('data', (msg) => logger.log('data: ' + msg));
        this.listenProcessStderr(diagramProcess);
        this.listenProcessStdout(diagramProcess, this.options);
        return diagramProcess;
    }

    private sendRunMsg(options: GeneratorOptions) {
        this.diagramProcess.send({ options, filesPattern: this.includeFiles });
    }

    private listenProcessStdout(diagramProcess: ChildProcess, options: GeneratorOptions): void {
        if (diagramProcess.stdout) {
            diagramProcess.stdout.on('data', (chunk) => {
                const progressMsg = chunk.toString('utf8', 0, 120).replace(options.baseDir, ' '); // .replace(/[\r\n]/g, ' ');
                this.progressSubject.next(progressMsg);
                logger.log(chunk.toString());
            });
        }
    }

    private listenProcessStderr(diagramProcess: ChildProcess) {
        if (diagramProcess.stderr) {
            diagramProcess.stderr.on('data', (data) => {
                logger.log('stderr: ' + data);
            });
        }
    }

    private async onProcessMesssage(msg: any) {
        if (msg.error) {
            this.cancel();
            this.reject(msg.error);
        }
        else {
            logger.log('Message from genereting process: ' + msg);
        }
    }

    private async onProcessExit(code: number | null, signal: string | null, resolve: (value?: unknown) => void) {
        logger.log(`exit code:  ${code} signal: ${signal}`);
        resolve({ code, signal });
    }

    private createDiagramProcessFilePath() {
        return path.join(__dirname, this.createDiagramProcessFile);
    }
}
