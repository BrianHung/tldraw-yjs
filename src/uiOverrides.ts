import { TLUiOverrides, toolbarItem } from '@tldraw/tldraw';

export const uiOverrides: TLUiOverrides = {
	tools(editor, tools) {
		tools.codeblock = {
			id: 'codeblock',
			icon: 'code',
			label: 'CodeBlock',
			kbd: 'c',
			onSelect: () => {
				editor.setCurrentTool('codeblock');
			},
		};
		tools.textblock = {
			id: 'textblock',
			icon: 'tool-text',
			label: 'TextBlock',
			kbd: 't',
			onSelect: () => {
				editor.setCurrentTool('textblock');
			},
		};
		return tools;
	},
	toolbar(_app, toolbar, { tools }) {
		// Add the tool item from the context to the toolbar.
		toolbar.splice(4, 0, toolbarItem(tools.codeblock), toolbarItem(tools.textblock));
		return toolbar;
	},
};
