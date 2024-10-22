import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('note-intel.NoteIntel', () => {

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
        const linePrefix = lineText.slice(0, position.character); // 当前光标前的文本

        // 记录当前行的缩进
        const indentMatch = linePrefix.match(/^\s*/); // 匹配行首的空格或制表符
        const currentIndent = indentMatch ? indentMatch[0] : '';

        const insertText = (begin: string, end: string, to?:string) => {
            editor.edit(editBuilder => {
                // 获取当前光标所在行，并插入目标代码
                const newPosition = position.with(position.line, 0);

				if(!to){
					editBuilder.replace(new vscode.Range(newPosition, position),`${currentIndent}${begin}\n${currentIndent}\n${currentIndent}${end}`);
				}else{
					editBuilder.replace(new vscode.Range(newPosition, position),`${currentIndent}${begin}\n${currentIndent}\n${currentIndent}${to}\n${currentIndent}\n${currentIndent}${end}`);
				}
                

                // 将光标移动到第一行的下一行
				setTimeout(()=>{
					const nextPosition = new vscode.Position(position.line+1, currentIndent.length);
                	editor.selection = new vscode.Selection(nextPosition, nextPosition);
				}, 500);
                
            });
        };

        // 检测 //${prefix}-replace-begin
        if (lineText.includes(`//${prefix}-replace-begin`) || lineText.includes(`//${prefix}-rep`) || lineText.includes(`//${prefix}rep`)) {
            insertText(`//${prefix}-replace-begin`, `//${prefix}-replace-end`, `//${prefix}-replace-to`);
        }

        // 检测 //${prefix}-add-begin
        if (lineText.includes(`//${prefix}-add-begin`) || lineText.includes(`//${prefix}-add`) || lineText.includes(`//${prefix}add`)) {
            insertText(`//${prefix}-add-begin`, `//${prefix}-add-end`);
        }

        // 检测 //${prefix}-remove-begin
        if (lineText.includes(`//${prefix}-remove-begin`) || lineText.includes(`//${prefix}-rem`) || lineText.includes(`//${prefix}rem`)) {
            insertText(`//${prefix}-remove-begin`, `//${prefix}-remove-end`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
