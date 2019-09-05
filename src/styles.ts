import * as vscode from "vscode";

export class RedTextStyle {
  private static _usageCount = 0;
  private static _style: vscode.TextEditorDecorationType | undefined;

  private static createStyle() {
    return vscode.window.createTextEditorDecorationType({
      color: "#ff6b6b"
    });
  }

  private static create() {
    this._style = this.createStyle();
  }

  public static apply(editor: vscode.TextEditor, range: vscode.Range[]) {
    if (this._style === undefined) { this.create(); }
    editor.setDecorations(this._style!, range);
    this._usageCount++;
  }

  public static dispose() {
    if (this._usageCount > 0 && this._style !== undefined) {
      this._style.dispose();
      this._usageCount = 0;

      this.create();
    }
  }
}