import vscode from 'vscode';

import { DataProvider } from './data-provider';

export class WorkspaceFolderNode2<T> {
    name: string;
    // private readonly actionsJsonPath: string;
    constructor(
        public readonly workspaceFolder: vscode.WorkspaceFolder,
        private readonly dataProvider: DataProvider<T>
    ) {
        this.name = workspaceFolder.name;
    }

    getChildren(): T[] {
        return this.dataProvider.getData();
    }

    get tooltip(): string {
        return this.contextValue;
    }

    hasData(): boolean {       
        // return true;
        return this.dataProvider.hasData();
    }

    contextValue = 'workspace-folder';
}
