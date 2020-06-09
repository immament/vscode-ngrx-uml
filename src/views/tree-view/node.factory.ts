import vscode from 'vscode';

import { TreeNode } from './tree-node';

export interface NodeFactory<T> {
    getTreeItem(element: TreeNode<T>): vscode.TreeItem | Thenable<vscode.TreeItem>;
    getChildren(element?: TreeNode<T>): TreeNode<T>[];
}
