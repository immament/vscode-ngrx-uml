import fs from 'fs';
import { Action } from 'ngrx-uml/dist/lib/actions/models';
import path from 'path';
import vscode from 'vscode';

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

        this.actionsJsonPath = path.join(workspaceFolder.uri.fsPath, 'out/json', 'action-references_Action.json');
    }

    protected getChildrenItems(): TreeNode[] {
        return this.getActionsFromJson(this.actionsJsonPath);

    }

    get tooltip(): string {
        return 'Action';
    }


    private getActionsFromJson(actionsJsonPath: string): TreeNode[] {

        if (pathExists(actionsJsonPath)) {
            const actions: Action[] = JSON.parse(fs.readFileSync(actionsJsonPath, 'utf-8'));
            return this.actionMapper.mapActions(actions);
        }
        return [];

    }

    contextValue = 'workspace-folder';
}
