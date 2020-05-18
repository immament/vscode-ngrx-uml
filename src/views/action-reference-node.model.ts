
import { ActionReference } from 'ngrx-uml/dist/lib/action-references/models/action-reference.model';
import path from 'path';
import vscode from 'vscode';

import { openTextDocumentCommand } from '../utils/utils';

import { TreeNode } from './tree-item.model';

export class ActionReferenceNode extends TreeNode {



    get tooltip(): string {
        return 'Action reference';
    }

    get description(): string {
        return this.actionRef.isCall ? 'dispatch' : 'listen';
    }

    contextValue = 'action-reference';

    iconPath?: { light: string; dark: string };

    constructor(
        private readonly actionRef: ActionReference,
        collapsibleState: vscode.TreeItemCollapsibleState
    ) {

        super(ActionReferenceNode.createName(actionRef), collapsibleState);

        if (actionRef.filePath) {
            this.command = openTextDocumentCommand(actionRef.filePath);
        }

        this.initIcon();
    }



    protected getChildrenItems(): TreeNode[] {
        if (this.actionRef.declarationContext) {
            return this.actionRef.declarationContext.map(declaration =>
                new TreeNode(declaration.name || declaration.kindText, vscode.TreeItemCollapsibleState.None, declaration.kindText)
            );
        }
        return [];
    }

    private static createName(actionRef: ActionReference): string {
        let name = actionRef.name;
        if (actionRef.declarationContext) {
            const declaraton = actionRef.declarationContext.reverse().find((declaration) => declaration.name);
            if (declaraton && declaraton.name) {
                name = declaraton.name;
            }
        }

        return name;
    }

    private initIcon() {
        const icon = this.actionRef.isCall ? 'boolean.svg' : 'document.svg';
        this.iconPath = {
            light: path.join(__dirname, '..', 'assets/images', 'light', icon),
            dark: path.join(__dirname, '..', 'assets/images', 'dark', icon)
        };
    }
}
