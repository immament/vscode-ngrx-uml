import { Action, ActionReference } from 'ngrx-uml/dist/lib/impl/models';
import vscode, { Uri } from 'vscode';

import { ActionReferenceNode } from './action-reference-node.model';
import { TreeNode } from './tree-item.model';

export class ActionNode extends TreeNode {

    constructor(
        label: string,
        public readonly action: Action,
        collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
        if (action.filePath) {
            this.command = {
                command: 'ngrx-uml.openFile',
                title: "Open File",
                arguments: [Uri.file(action.filePath)]
            };
        }
    }


    protected getChildrenItems(): TreeNode[] {
        if (this.action.references) {

            const fileGroups = this.action.references.reduce((groups, ref) => {
                if (ref.fileName) {
                    (groups[ref.fileName] || (groups[ref.fileName] = [])).push(ref);
                }
                return groups;
            }, {} as { [key: string]: ActionReference[] });

            return Object.entries(fileGroups).map(([fileName, refs]) => {
                return new TreeNode(fileName,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    undefined,
                    refs.map((item) => new ActionReferenceNode(item, vscode.TreeItemCollapsibleState.Collapsed))
                );
            });
          
        }
        return [];

    }

    get tooltip(): string {
        return 'Action';
    }


    contextValue = 'action';
}
