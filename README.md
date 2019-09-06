
# Specflow Tools for Visual Studio Code extension

#### ***This extension is in early stages of development. There is more to come!***

I recommend you use this extension with the [Gherkin step autocomplete](https://marketplace.visualstudio.com/items?itemName=silverbulleters.gherkin-autocomplete) extension until Specflow Tools supports step snippets.

## What does it do?

 1. **Go-To step definitions**
		 The default keybind is [F12]
		![Specflow Tools - GoTo Step](https://i.ibb.co/k3vFBWM/goto-binding.gif)

 2.  **Table Formatting**
		 ![Specflow Tools - Table Formatting](https://i.ibb.co/y6GbWQL/table-formatting.gif)

3. **Error Highlighting**
![Specflow Tools - Error Highlighting](https://i.ibb.co/6vCLSRN/error-highlighting.gif)

## Configuration

_specflowtools.stepfilesearchglob_ - The file search glob to locate .CS files with specflow step bindings

## Planned Features

 - Step snippets (auto-complete)
 - Find references to implemented steps
 - Auto-fill table headers
 - Code generation for unimplemented steps


## Known Issues

 - Cannot step into binding if the verb is "And" and there is no other step before it.
