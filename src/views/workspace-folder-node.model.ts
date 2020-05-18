import fs from 'fs';
import { Action } from 'ngrx-uml/dist/lib/actions/models';
import path from 'path';
import vscode from 'vscode';

import { OutputConfiguration } from '../models/configuration.model';
import logger from '../utils/logger';
import { pathExists } from '../utils/utils';

import { ActionMapper } from './action.mapper';
import { TreeNode } from './tree-item.model';

export class WorkspaceFolderNode extends TreeNode {
    private readonly actionsJsonPath: string;

    constructor(
        label: string,
        collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly workspaceFolder: vscode.WorkspaceFolder,
        private readonly actionMapper: ActionMapper
    ) {
        super(label, collapsibleState);
        this.actionsJsonPath = this.getActionJsonPath();
    }


    private getActionJsonPath() {
        const outputConfig = vscode.workspace.getConfiguration('ngrxUml', this.workspaceFolder).get('output') as OutputConfiguration;
        return path.join(this.workspaceFolder.uri.fsPath, outputConfig.outDir, 'json', 'action-references_Action.json');

    }
    protected getChildrenItems(): TreeNode[] {
        return this.getActionsFromJson();

    }

    get tooltip(): string {
        return 'Action';
    }

    hasData(): boolean {

        const exists = pathExists(this.actionsJsonPath);
        logger.log(`$pathExists ${this.actionsJsonPath} [${exists}]`);
        return exists;
    }


    private getActionsFromJson(): TreeNode[] {

        if (this.hasData()) {
            const actions: Action[] = JSON.parse(fs.readFileSync(this.actionsJsonPath, 'utf-8'));
            return this.actionMapper.mapActions(actions);
        }
        return [];

    }

    contextValue = 'workspace-folder';
}
