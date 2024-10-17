/*
 * @Author: Sam
 * @Date: 2024-10-16 17:39:20
 * @LastEditTime: 2024-10-17 18:01:34
 * @LastEditors: Sam
 */
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('note-intel.CodeIntel', () => {

		const config = vscode.workspace.getConfiguration('note-intel');
		const prefix = config.get('prefix') || 'gisv';
		console.log('prefix----------------------', prefix);

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // 没有打开的文本编辑器
        }

        const document = editor.document;
        const selection = editor.selection;
        const position = selection.active;

        // 获取光标前的内容
        const lineText = document.lineAt(position.line).text;

        // 如果检测到用户输入了“//${prefix}-replace-begin”
        if (lineText.includes(`//${prefix}-replace-begin`) || lineText.includes(`//${prefix}-rep`)) {
            editor.edit(editBuilder => {
                // 获取当前光标所在行，并插入目标代码
                const newPosition = position.with(position.line, 0);
                editBuilder.replace(new vscode.Range(newPosition, position), `//${prefix}-replace-begin\n\n//${prefix}-replace-to\n\n//${prefix}-replace-end`);

                // 将光标移动到下一个编辑位置
                const nextPosition = new vscode.Position(position.line + 1, 0);
                editor.selection = new vscode.Selection(nextPosition, nextPosition);
            });
        }

		// 如果检测到用户输入了“//${prefix}-replace-begin”
        if (lineText.includes(`//${prefix}-add-begin`) || lineText.includes(`//${prefix}-add`)) {
            editor.edit(editBuilder => {
                // 获取当前光标所在行，并插入目标代码
                const newPosition = position.with(position.line, 0);
                editBuilder.replace(new vscode.Range(newPosition, position), `//${prefix}-add-begin\n\n//${prefix}-add-end`);

                // 将光标移动到下一个编辑位置
                const nextPosition = new vscode.Position(position.line + 1, 0);
                editor.selection = new vscode.Selection(nextPosition, nextPosition);
            });
        }

		// 如果检测到用户输入了“//${prefix}-replace-begin”
        if (lineText.includes(`//${prefix}-remove-begin`) || lineText.includes(`//${prefix}-rem`)) {
            editor.edit(editBuilder => {
                // 获取当前光标所在行，并插入目标代码
                const newPosition = position.with(position.line, 0);
                editBuilder.replace(new vscode.Range(newPosition, position), `//${prefix}-remove-begin\n\n//${prefix}-remove-end`);

                // 将光标移动到下一个编辑位置
                const nextPosition = new vscode.Position(position.line + 1, 0);
                editor.selection = new vscode.Selection(nextPosition, nextPosition);
            });
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
