import { WorkspaceFolderNode2 } from './workspace-folder-node.model';

export interface WorkspaceProvider<T> {
    getWorkspaceNodes(): WorkspaceFolderNode2<T>[];
}
