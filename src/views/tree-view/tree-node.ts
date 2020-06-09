import { WorkspaceFolderNode2 } from './workspace-folder-node.model';

export type TreeNode<T> = T | WorkspaceFolderNode2<T>;
