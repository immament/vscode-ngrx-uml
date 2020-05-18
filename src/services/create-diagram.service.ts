import { GeneratorOptions } from 'ngrx-uml';
import path from 'path';
import { Subscription } from 'rxjs';
import vscode from 'vscode';

import { InputConfiguration } from '../models/configuration.model';
import logger, { outputChannel } from '../utils/logger';
import { resetStatusBar } from '../utils/status-bar';

import { GeneretingProcessService } from './genereting-process.service';
import { NgrxUmlConfigService } from './ngrx-uml-config.service';
import { ProgressUpdater } from './progress-updater';

export class CreateDiagramService {
    private configService: NgrxUmlConfigService;
    private inputConfig: InputConfiguration;

    constructor(
        private readonly workspaceFolder: vscode.WorkspaceFolder,
        private readonly statusBar?: vscode.StatusBarItem
    ) {

        this.showRunningStateInStatus();

        this.configService = new NgrxUmlConfigService(this.workspaceFolder);
        this.inputConfig = this.configService.getInputConfig();
    }

    public generateWithProgress() {

        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Generating",
            cancellable: true,
        }, (progress, cancellationToken) => this.generatingTask(progress, cancellationToken))
        .then(async (value: any) => {
            if (!value.signal) {
                const btn = await vscode.window.showInformationMessage('Generating finished', 'View Report');
                if (btn === 'View Report') {
                    outputChannel.show();
                }
            }
        }, async (err) => {
            logger.log('err: ' + err);
            const btn = await vscode.window.showErrorMessage('Generating error: ' + err, 'View Report');
            if (btn === 'View Report') {
                outputChannel.show();
            }
            throw err;
        });
    }

    private generatingTask(
        progress: vscode.Progress<{ message?: string | undefined; increment?: number | undefined; }>,
        cancellationToken: vscode.CancellationToken
    ) {
        let generetingProcessService: GeneretingProcessService;
        const progressUpdater = new ProgressUpdater(progress);

        cancellationToken.onCancellationRequested(() => {
            if (generetingProcessService) {
                generetingProcessService.cancel();
            }
            logger.log("User canceled the running operation");
        });

        const subscriptions: Subscription[] = [];

        const promise =  new Promise((resolve, reject) => {
            generetingProcessService = new GeneretingProcessService(
                this.createGeneratorOptions(),
                this.inputConfig.includeFiles,
                resolve,
                reject
            );
            subscriptions.push(generetingProcessService.progress.subscribe(msg => progressUpdater.update(msg)));
            generetingProcessService.run();
        }).finally(() => {
            resetStatusBar(this.statusBar);
            progressUpdater.dispose();
            for(var subs of subscriptions) {
                subs.unsubscribe();
            }
        });

        return promise;
    }

    private showRunningStateInStatus() {
        if (this.statusBar) {
            this.statusBar.text = '$(sync~spin) Generating diagrams';
            this.statusBar.show();
        }
    }

    private createGeneratorOptions(): GeneratorOptions {
        const baseDir = this.workspaceFolder.uri.fsPath;

        const inputConfig = this.configService.getInputConfig();
        const outputConfig = this.configService.getOutputConfig();
        const generalConfig = this.configService.getGeneralConfig();

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

}

