import { ChildProcess, fork } from 'child_process';
import { GeneratorOptions } from 'ngrx-uml';
import path from 'path';
import * as vscode from 'vscode';

import {
    GeneralConfiguration, InputConfiguration, OutputConfiguration
} from '../models/configuration.model';
import logger, { outputChannel } from '../utils/logger';
import { resetStatusBar } from '../utils/status-bar';

export function generateWithProgress(workspaceFolder: string, statusBar: vscode.StatusBarItem) {

    statusBar.text = '$(sync~spin) Generating diagrams';
    statusBar.show();

    const withProgressPromise = vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Generating",
        cancellable: true
    }, (progress, token) => {

        let forked: ChildProcess;
        token.onCancellationRequested(() => {
            if (forked) {
                forked.kill();
            }
            logger.log("User canceled the long running operation");
        });

        var progressUpdate = 'Starting up...';

        const progressInterval = setInterval(() => progress.report({ message: progressUpdate }), 500);

        return new Promise((resolve) => {

            const options = createOptions(workspaceFolder);
            logger.log('__dirname: ' +__dirname);
            const pathTasks = path.join(__dirname, 'create-diagram-process.js');

            forked = fork(pathTasks, [], {
                silent: true,
                detached: true
            }).on('error', (err) => {
                logger.log("\n\t\tERROR: spawn failed! (" + err + ")");
            }).on('message', (msg) => {
                logger.log('Message from child: ' + msg);
            }).on('exit', async (code, signal) => {
                logger.log(`exit code:  ${code} signal: ${signal}`);
                resolve();
                clearInterval(progressInterval);
                resetStatusBar(statusBar);
                const btn = await vscode.window.showInformationMessage('Genereting finished', 'View Report');
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
                forked.stdout.on('data', (data) => {
                    progressUpdate = data.toString('utf8', 0, 50).replace(/[\r\n]/g, ' ');
                    logger.log('stdout: ' + data);
                });
            }

            forked.send({ baseDir: workspaceFolder, options });

        }).catch((err) => {
            logger.log('err:' + err);
            throw err;
        });

    });
    return withProgressPromise;
}


function createOptions(baseDir: string) {
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
