import { Action } from 'ngrx-uml/dist/lib/actions/models';
import vscode from 'vscode';

import { ActionNode } from './action-node.model';

export class ActionMapper {

    map(action: Action) {
        return new ActionNode(action.name, action, vscode.TreeItemCollapsibleState.Collapsed);
    }

    mapActions(actions: Action[]) {
        return actions.map(a => this.map(a));
    }
}
