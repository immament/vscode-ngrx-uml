import { StatusBarItem, workspace } from 'vscode';

export function resetStatusBar(statusBar?: StatusBarItem) {
	if (statusBar) {
		const showStatusBar = workspace.getConfiguration('ngrxUml').get<string>('general.showStatusBar');

		statusBar.text = '$(play) NgrxUml';
		if (showStatusBar) {
			statusBar.show();
		} else {
			statusBar.hide();
		}
	}
}