import { keymap } from '@codemirror/view';
import React from 'react';
import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next';
import { Awareness } from 'y-protocols/awareness.js';
import * as Y from 'yjs';
import { useYjs } from '../../hooks/useYjs.tsx';
import { CodeMirror } from './CodeMirror.tsx';

/**
 * Unlike y-prosemirror, y-codemirror does not initialize doc from ytext by default.
 * https://github.com/yjs/y-codemirror.next
 */

export const CodeBlock = React.memo((props: { id: string; autoFocus: boolean }) => {
	const { id: shapeId, autoFocus } = props;
	const id = shapeId.replace(/^shape:/, '');
	const { defaultDoc, collab } = useYjs(
		({ ydoc, provider }) => {
			const ytext = ydoc.get(`codeblock/${id}`, Y.Text);
			return {
				defaultDoc: ytext.toString(),
				collab: yCollabWithKeymap(ytext, provider.awareness),
			};
		},
		[id]
	);
	return (
		<CodeMirror
			defaultDoc={defaultDoc}
			extensions={collab}
			autoFocus={autoFocus}
			editable={true}
		/>
	);
});

function yCollabWithKeymap(type: Y.Text, awareness: Awareness, options: Record<string, any> = {}) {
	return [yCollab(type, awareness, options), keymap.of(yUndoManagerKeymap)] as const;
}
