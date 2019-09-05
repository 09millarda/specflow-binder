import { IBinding } from ".";
import * as vscode from "vscode";
import { getCurrentStep, getFileExtension, getActiveEditor, findBinding, resetStyling, getLastCharacter } from "./helpers";
import { RedTextStyle } from "./styles";

export default class FeatureHandler {
  public static async validateSteps(doc: vscode.TextDocument, bindings: IBinding[]) {
    if (getFileExtension(doc.uri) !== "feature") { return; }
    RedTextStyle.dispose();
    const lineCount = doc.lineCount;
    
    const ranges: vscode.Range[] = [];
    for (let currLine = 0; currLine < lineCount; currLine++) {
      const step = getCurrentStep(currLine, doc);
      const line = doc.lineAt(currLine);
      if (step === undefined) { continue; }

      if (findBinding(bindings, step) === undefined) {
        ranges.push(new vscode.Range(line.range.start, line.range.end));
      }      
    }

    const editor = getActiveEditor();
    if (editor === undefined) { return; }

    RedTextStyle.apply(editor, ranges);
  }

  public static async formatTable(doc: vscode.TextDocument) {
    if (getFileExtension(doc.uri) !== "feature") { return; }
    const editor = getActiveEditor();
    if (editor === undefined) { return; }
    
    let lastCharacter = getLastCharacter(doc.lineAt(editor.selection.active.line).text);
    if (lastCharacter !== "|") { return; }

    const lines: string[][] = [];

    let currLine = editor.selection.active.line;
    while ((lastCharacter = getLastCharacter(doc.lineAt(currLine).text)) === "|" && currLine > 0) {
      const columns = doc.lineAt(currLine).text.split("|").map(t => t.trim());
      lines.push(columns);
      currLine--;
    }

    const startLineNumber = currLine + 1;
    const startColumnNumber = doc.lineAt(startLineNumber).firstNonWhitespaceCharacterIndex;
    const endLineNumber = startLineNumber + lines.length - 1;
    const endColumnNumber = doc.lineAt(endLineNumber).text.length;

    let startSpacing = "";
    for (let i = 0; i < startColumnNumber; i++ ) {
      startSpacing += " ";
    }
    const table = startSpacing + FeatureHandler.shapeTable(lines).join("\n" + startSpacing);

    editor.edit(builder => {
      const startPos = new vscode.Position(startLineNumber, 0);
      const endPos = new vscode.Position(endLineNumber, endColumnNumber);
      const selection = new vscode.Selection(startPos, endPos);
      builder.delete(selection);
      builder.insert(startPos, table);
    });
  }

  private static shapeTable(lines: string[][]) {
    const columnLengths: number[] = [];
    for (let column = 0; column < lines[0].length; column++) {
      let longestColumnChars = 0;
      for (let row = 0; row < lines.length; row++) {
        if (lines[row][column].length > longestColumnChars) {
          longestColumnChars = lines[row][column].length;
        }
      }
      columnLengths.push(longestColumnChars);
    }
    let table = lines.map(line => {
      const row = line.map((column, i) => {
        let _row = ` ${column} `;
        for (let j = 0; j < columnLengths[i] - column.length; j++) {
          _row += " ";
        }
        return _row;
      });
      return row.join("|").trim();
    });
    return table.reverse();
  }
}