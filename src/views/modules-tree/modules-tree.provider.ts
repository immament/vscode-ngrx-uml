
import vscode from 'vscode';

import logger from '../../utils/logger';
import { NodeFactory } from '../tree-view/node.factory';
import { TreeNode } from '../tree-view/tree-node';

export class ModulesTreeProvider<T> implements vscode.TreeDataProvider<TreeNode<T>> {

    private _onDidChangeTreeData = new vscode.EventEmitter<TreeNode<T> | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private factory: NodeFactory<T>) {
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: TreeNode<T>): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return this.factory.getTreeItem(element);
    }

    getChildren(element?: TreeNode<T> | undefined): vscode.ProviderResult<TreeNode<T>[]> {
        return this.factory.getChildren(element);
    }

    // workspace


}