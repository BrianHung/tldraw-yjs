import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import 'prosemirror-view/style/prosemirror.css';
import React from 'react';
import { plugins as basicPlugins, schema } from './ProseMirror';
import './y-prosemirror.css';

interface ProseMirrorProps {
	plugins?: Plugin[];
	autoFocus?: boolean;
	editable?: boolean;
}

export const ProseMirror = React.memo((props: ProseMirrorProps) => {
	const { plugins = [], autoFocus = false, editable = true } = props;
	const mountRef = React.useRef<HTMLElement | null>(null);
	const viewRef = React.useRef<EditorView | null>(null);
	React.useEffect(
		function initEditor() {
			const state = EditorState.create({
				schema,
				plugins: basicPlugins.concat(plugins),
			});
			const place = mountRef.current;
			const view = new EditorView(place, {
				state,
				attributes: { style: 'height: 100%; font-size: 16px; line-height: 1.5; padding: 20px;' },
			});
			viewRef.current = view;
			return () => {
				view.destroy();
			};
		},
		[plugins]
	);
	React.useLayoutEffect(() => {
		if (autoFocus) {
			viewRef.current?.focus();
			window.requestAnimationFrame(() => viewRef.current?.focus());
		}
	}, [autoFocus]);
	React.useEffect(() => {
		viewRef.current?.setProps({ editable: () => editable });
	}, [editable]);
	return (
		<div
			className="h-full overflow-hidden border border-pink-300 bg-pink-200 shadow-lg"
			ref={mountRef}
		/>
	);
});
