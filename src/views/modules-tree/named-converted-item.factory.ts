import { NamedConvertedItem, TypeKind } from 'ngrx-uml/dist/lib/core/converters/models';
import { NgModule } from 'ngrx-uml/dist/lib/core/converters/models/converted-items/ng-module.model';
import {
    RegisteredReducerItem
} from 'ngrx-uml/dist/lib/sandbox/converters/models/registered-reducer.model';
import vscode from 'vscode';

import { openTextDocumentWithOffsetCommand } from '../../utils/utils';
import { NodeFactory } from '../tree-view/node.factory';
import { TreeNode } from '../tree-view/tree-node';
import { WorkspaceFolderNode2 } from '../tree-view/workspace-folder-node.model';
import { WorkspaceProvider } from '../tree-view/workspace.provider';

export class NamedConvertedItemFactory implements NodeFactory<NamedConvertedItem> {
    
    constructor(private readonly workspaceProvider: WorkspaceProvider<NamedConvertedItem>) {
    }

    getTreeItem(element: TreeNode<NamedConvertedItem>): vscode.TreeItem | Thenable<vscode.TreeItem> {
        const anyElement = element as any;
        if (anyElement.contextValue === 'workspace-folder') {
            const wf = element as WorkspaceFolderNode2<NamedConvertedItem>;
            return {
                label: wf.name,
                collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
            };
        }
        const item = anyElement as NamedConvertedItem;
        return {
            label: anyElement.name,
            description: anyElement.kindText,
            collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
            command: item.filePath ? openTextDocumentWithOffsetCommand(item.filePath, item.pos, item.end ) : undefined
        };
    }

    getChildren(element?: TreeNode<NamedConvertedItem>): TreeNode<NamedConvertedItem>[] {
        if (!element) {
            return this.workspaceProvider.getWorkspaceNodes();
        }
        const anyElement = element as any;
        if (anyElement.contextValue === 'workspace-folder') {
            const wf = element as WorkspaceFolderNode2<NamedConvertedItem>;
            return wf.getChildren();
        }
        switch (anyElement.kind) {
            case TypeKind.NgModule: {
                const module = anyElement as NgModule;
                return module.registeredReducers || [];
            }
            case TypeKind.RegisteredReducer: {
                const reducer = anyElement as RegisteredReducerItem;
                if (reducer.reducerItems) {
                    return reducer.reducerItems;
                }
            }
            default:
                break;
        }
        return [];
    }

}
