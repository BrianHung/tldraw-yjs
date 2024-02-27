import { exampleSetup } from 'prosemirror-example-setup';
import { Node, Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

function textToDOM(text: string) {
	const placeholder = document.createElement('div');
	placeholder.textContent = text;
	placeholder.className = 'ProseMirror-placeholder';
	placeholder.style.color = 'rgb(0,0,0,0.35)';
	placeholder.style.position = 'absolute';
	placeholder.style.userSelect = 'none';
	return placeholder;
}

function placeholder(text: string) {
	let emptyDoc: Node;
	return new Plugin({
		props: {
			decorations({ doc }) {
				emptyDoc = emptyDoc || doc.type.createAndFill();
				const isEditorEmpty = emptyDoc.sameMarkup(doc) && emptyDoc.content.findDiffStart(doc.content) === null;
				if (isEditorEmpty) {
					return DecorationSet.create(doc, [Decoration.widget(0, textToDOM(text))]);
				}
			},
		},
	});
}

export const schema = new Schema({
	nodes: addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block'),
	marks: basicSchema.spec.marks,
});

export const plugins = [...exampleSetup({ schema, menuBar: false, history: false }), placeholder('Type anything')];
