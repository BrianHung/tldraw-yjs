import { keymap } from 'prosemirror-keymap';
import React from 'react';
import { redo, undo, yCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror';
import { Awareness } from 'y-protocols/awareness.js';
import * as Y from 'yjs';
import { useYjs } from '../../hooks/useYjs.tsx';
import { ProseMirror } from './ProseMirror.tsx';

export const TextBlock = React.memo((props: { id: string; autoFocus: boolean }) => {
	const { id: shapeId, autoFocus } = props;
	const id = shapeId.replace(/^shape:/, '');
	const collab = useYjs(
		({ ydoc, provider }) => yCollab(ydoc.get(`textblock/${id}`, Y.XmlFragment), provider.awareness),
		[id]
	);
	return (
		<ProseMirror
			plugins={collab}
			autoFocus={autoFocus}
			editable={autoFocus}
		/>
	);
});

/**
 * https://github.com/yjs/y-prosemirror
 */

function yCollab(type: Y.XmlFragment, awareness: Awareness, options: Record<string, any> = {}) {
	return [
		ySyncPlugin(type, options),
		yCursorPlugin(awareness, options),
		yUndoPlugin(options),
		keymap({
			'Mod-z': undo,
			'Mod-y': redo,
			'Mod-Shift-z': redo,
		}),
	] as const;
}
