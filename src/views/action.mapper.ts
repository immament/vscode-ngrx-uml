import { Action } from 'ngrx-uml/dist/lib/impl/models';
import vscode from 'vscode';

import { ActionNode } from './action-node.model';

export interface Mapper<S, R> {
    map(item: S): R;
    mapItems(items: S[]): R[];
}

export class ActionMapper implements Mapper<Action, ActionNode> {

    map(action: Action) {
        return new ActionNode(action.name, action, vscode.TreeItemCollapsibleState.Collapsed);
    }

    mapItems(actions: Action[]) {
        return actions.map(a => this.map(a));
    }
}
