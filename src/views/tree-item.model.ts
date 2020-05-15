import path from 'path';
import vscode from 'vscode';

export class TreeNode extends vscode.TreeItem {



    constructor(
        label: string,
        collapsibleState: vscode.TreeItemCollapsibleState,
        description?: string,
        private children?: TreeNode[]
    ) {

        super(label, collapsibleState);
        if (description) {
            this.description = description;
        }
    }

    protected getChildrenItems(): TreeNode[] {
        return [];
    }

    getChildren(): TreeNode[] {
        if (!this.children) {
            this.children = this.getChildrenItems();
        }
        return this.children;
    }



}
