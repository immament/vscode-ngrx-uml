import fs from 'fs';
import { Action } from 'ngrx-uml/dist/lib/impl/models';
import path from 'path';
import vscode from 'vscode';

import { NgrxUmlConfigService } from '../services/ngrx-uml-config.service';
import logger from '../utils/logger';
import { pathExists } from '../utils/utils';

import { ActionMapper } from './action.mapper';
import { TreeNode } from './tree-item.model';

export class WorkspaceFolderNode extends TreeNode {
    private readonly actionsJsonPath: string;
    private readonly configService: NgrxUmlConfigService;
    constructor(
        label: string,
        collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly workspaceFolder: vscode.WorkspaceFolder,
        private readonly actionMapper: ActionMapper,

    ) {

        super(label, collapsibleState);
        this.configService = new NgrxUmlConfigService(workspaceFolder);
        this.actionsJsonPath = this.getActionJsonPath();
    }


    private getActionJsonPath() {
        const inputConfig = this.configService.getInputConfig();
        const outputConfig = this.configService.getOutputConfig();
        return path.join(this.workspaceFolder.uri.fsPath, inputConfig.baseDir, outputConfig.outDir, 'json', 'action-references_Action.json');
    }

    protected getChildrenItems(): TreeNode[] {
        return this.getActionsFromJson();

    }

    get tooltip(): string {
        return 'Action';
    }

    hasData(): boolean {

        const exists = pathExists(this.actionsJsonPath);
        logger.log(`$pathExists ${this.actionsJsonPath} [${exists}]`);
        return exists;
    }


    private getActionsFromJson(): TreeNode[] {

        if (this.hasData()) {
            const actionsData: { data: Action[] } = JSON.parse(fs.readFileSync(this.actionsJsonPath, 'utf-8'));
            if (actionsData?.data) {
                return this.actionMapper.mapActions(actionsData.data);
            } else if(this.isNgrxUml_1_0_0_Data(actionsData)) { // Compatibility to ngrx-uml v.1.0.0
                return this.actionMapper.mapActions(actionsData);
            }
        }
        return [];

    }

    private isNgrxUml_1_0_0_Data(data: any): data is Action[] {
        return data && Array.isArray(data);
    }

    contextValue = 'workspace-folder';
}
