import { ChildProcess, fork } from 'child_process';
import { GeneratorOptions } from 'ngrx-uml';
import * as path from 'path';
import * as vscode from 'vscode';

import {
    GeneralConfiguration, InputConfiguration, OutputConfiguration
} from '../models/configuration.model';
import logger, { outputChannel } from '../utils/logger';
import { resetStatusBar } from '../utils/status-bar';

export function generateWithProgress(workspaceFolder: string, statusBar: vscode.StatusBarItem) {

    statusBar.text = '$(sync~spin) Generating diagrams';
    statusBar.show();

    const inputConfig = vscode.workspace.getConfiguration('ngrxUml').get('input') as InputConfiguration;

    const withProgressPromise = vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Generating",
        cancellable: true,
    }, (progress, token) => {

        let forked: ChildProcess;
        token.onCancellationRequested(() => {
            if (forked) {
                forked.kill();
            }
            logger.log("User canceled the running operation");
        });

        var progressUpdate = 'Starting up...';

        const progressInterval = setInterval(() => progress.report({ message: progressUpdate }), 500);

        return new Promise((resolve) => {

            const options = createOptions(workspaceFolder);
            const pathTasks = path.join(__dirname, 'create-diagram-process.js');

            forked = fork(pathTasks, [], {
                silent: true,
                detached: true
            }).on('error', (err) => {
                logger.log("\n\t\tERROR: fork failed! (" + err + ")");
            }).on('message', (msg) => {
                logger.log('Message from fork: ' + msg);
            }).on('exit', async (code, signal) => {
                logger.log(`exit code:  ${code} signal: ${signal}`);
                resolve();
                clearInterval(progressInterval);
                resetStatusBar(statusBar);
                const btn = await vscode.window.showInformationMessage('Generating finished', 'View Report');
                if (btn === 'View Report') {
                    outputChannel.show();
                }
            }).on('data', (msg) => {
                logger.log('data: ' + msg);
            });

            if (forked.stderr) {
                forked.stderr.on('data', (data) => {
                    logger.log('stderr: ' + data);
                });
            }

            if (forked.stdout) {
                forked.stdout.on('data', (chunk) => {
                    progressUpdate = chunk.toString('utf8', 0, 120).replace(options.baseDir, ' '); // .replace(/[\r\n]/g, ' ');
                    logger.log(chunk.toString());
                });
            }

            forked.send({ options, filesPattern: inputConfig.includeFiles });

        }).catch((err) => {
            logger.log('err:' + err);
            throw err;
        });

    });
    return withProgressPromise;
}


function createOptions(baseDir: string): GeneratorOptions {
    const config = vscode.workspace.getConfiguration('ngrxUml');

    const inputConfig = config.get('input') as InputConfiguration;
    const outputConfig = config.get('output') as OutputConfiguration;
    const generalConfig = config.get('general') as GeneralConfiguration;

    const options: GeneratorOptions = {
        baseDir,
        ignorePattern: inputConfig.ignoreFiles,
        tsConfigFileName: inputConfig.tsConfigFile,

        outDir: path.join(baseDir, outputConfig.outDir),
        generateImages: outputConfig.generateDiagramImages,
        imageFormat: outputConfig.generateDiagramImages ? outputConfig.imageFormat : 'off',
        saveConvertResultToJson: outputConfig.generateJsonFiles,
        saveWsd: outputConfig.generateWsdFiles,

        logLevel: generalConfig.logLevel as any,
        clickableLinks: generalConfig.clickableLinks,
    };

    return options;
}
