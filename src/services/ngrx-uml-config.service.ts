import * as vscode from 'vscode';

import {
    GeneralConfiguration, InputConfiguration, OutputConfiguration
} from '../models/configuration.model';

const ngrxConfigKey = 'ngrxUml';

export enum NgrxConfigKeys {
    input = 'input',
    output = 'output',
    general = 'general'
}

export class NgrxUmlConfigService {


    constructor(private readonly workspaceFolder?: vscode.WorkspaceFolder) {
    }

    getConfiguration() {
        return vscode.workspace.getConfiguration(ngrxConfigKey, this.workspaceFolder);
    }

    getInputConfig(workspaceConfiguration?: vscode.WorkspaceConfiguration): InputConfiguration {
        return this.getConfig<InputConfiguration>(NgrxConfigKeys.input,  workspaceConfiguration);
    }

    getOutputConfig(workspaceConfiguration?: vscode.WorkspaceConfiguration): OutputConfiguration {
        return this.getConfig<OutputConfiguration>(NgrxConfigKeys.output,  workspaceConfiguration);
    }

    getGeneralConfig(workspaceConfiguration?: vscode.WorkspaceConfiguration): GeneralConfiguration {
        return this.getConfig<GeneralConfiguration>(NgrxConfigKeys.general,  workspaceConfiguration);
    }

    getConfig<T>(key: string, workspaceConfiguration?: vscode.WorkspaceConfiguration): T {
        if (!workspaceConfiguration) {
            workspaceConfiguration = this.getConfiguration();
        }
        return workspaceConfiguration.get<T>(key, {} as T);
    }

}
