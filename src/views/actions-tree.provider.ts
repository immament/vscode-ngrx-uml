
import vscode from 'vscode';

import { ActionMapper } from './action.mapper';
import { TreeNode } from './tree-item.model';
import { WorkspaceFolderNode } from './workspace-folder-node.model';

export class ActionsTreeProvider implements vscode.TreeDataProvider<TreeNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<TreeNode | undefined> = new vscode.EventEmitter<TreeNode | undefined>();
    readonly onDidChangeTreeData: vscode.Event<TreeNode | undefined> = this._onDidChangeTreeData.event;

    constructor(
        private actionMapper: ActionMapper
    ) {

    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: TreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: TreeNode | undefined): vscode.ProviderResult<TreeNode[]> {
        if (element) {
            return Promise.resolve(element.getChildren());
        }

        return Promise.resolve(this.workspaceNodes());
    }


    private workspaceNodes(): TreeNode[] {
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            return vscode.workspace.workspaceFolders
                .map(folder => new WorkspaceFolderNode(folder.name, vscode.TreeItemCollapsibleState.Expanded, folder, this.actionMapper))
                .filter(wfn => wfn.hasData());
        }
        return [];
    }

}