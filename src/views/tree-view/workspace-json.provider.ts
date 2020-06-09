import path from 'path';
import vscode from 'vscode';

import { NgrxUmlConfigService } from '../../services/ngrx-uml-config.service';

import { JsonDataProvider } from './json-data.provider';
import { WorkspaceFolderNode2 } from './workspace-folder-node.model';

export class WorkspaceJsonProvider<T> {
    constructor(private readonly jsonFileName: string) { }

    getWorkspaceNodes(): WorkspaceFolderNode2<T>[] {
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            return vscode.workspace.workspaceFolders
                .map(folder => new WorkspaceFolderNode2(folder, this.getDataProvider(folder)))
                .filter(node => node.hasData());
        }
        return [];
    }
    private getDataJsonPath(workspaceFolder: vscode.WorkspaceFolder, fileName: string) {
        const configService = new NgrxUmlConfigService(workspaceFolder);
        const inputConfig = configService.getInputConfig();
        const outputConfig = configService.getOutputConfig();
        return path.join(workspaceFolder.uri.fsPath, inputConfig.baseDir, outputConfig.outDir, 'json', fileName);
    }
    private getDataProvider(folder: vscode.WorkspaceFolder) {
        return new JsonDataProvider<T>(this.getDataJsonPath(folder, this.jsonFileName));
    }
}
