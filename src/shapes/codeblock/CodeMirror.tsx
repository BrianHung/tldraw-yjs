import { Compartment, Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import React from 'react';
import { basicSetup } from './CodeMirror';

interface CodeMirrorProps {
	extensions?: Extension[];
	autoFocus?: boolean;
	editable?: boolean;
	defaultDoc?: string; // only used for initialization, not-controlled
}

export const CodeMirror = React.memo((props: CodeMirrorProps) => {
	const { extensions = [], autoFocus = false, editable = true, defaultDoc = '' } = props;
	const mountRef = React.useRef<HTMLElement | null>(null);
	const viewRef = React.useRef<EditorView | null>(null);
	React.useEffect(
		function initEditor() {
			const view = new EditorView({
				doc: defaultDoc,
				parent: mountRef.current as HTMLElement,
				extensions: [...extensions, basicSetup, viewExtensions],
			});
			viewRef.current = view;
			return () => {
				view.destroy();
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[extensions]
	);
	React.useLayoutEffect(() => {
		if (autoFocus) {
			viewRef.current?.focus();
			window.requestAnimationFrame(() => viewRef.current?.focus());
		}
	}, [autoFocus]);
	React.useEffect(() => {
		viewRef.current?.dispatch({ effects: editableCompartment.reconfigure(EditorView.editable.of(editable)) });
	}, [editable]);
	return (
		<div
			className="h-full overflow-hidden rounded-lg border border-gray-300 bg-gray-100"
			ref={mountRef}
		/>
	);
});

const editableCompartment = new Compartment();
const viewExtensions = [
	editableCompartment.of(EditorView.editable.of(false)),
	EditorView.lineWrapping,
	EditorView.editorAttributes.of({ style: 'height: 100%; background: inherit' }),
	EditorView.theme({
		'&': {
			fontSize: '16px',
		},
		'.cm-scroller': {
			padding: '1rem 0',
			lineHeight: '1.5',
		},
		'.cm-gutters': {
			borderRight: 'none',
			backgroundColor: 'transparent',
			color: '#a3a3a3',
		},
		'.cm-activeLineGutter': {
			backgroundColor: '#cceeff44',
		},
		'.cm-placeholder': {
			color: '#a3a3a3',
		},
		'&.cm-focused': {
			outline: 'none',
		},
		'&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
			backgroundColor: '#bae6fdbf',
		},
		'& .cm-line': {
			padding: '0 12px',
		},
		'.cm-gutter.cm-lineNumbers': {
			minWidth: '40px',
		},
		'.cm-ySelectionInfo': {
			fontFamily: 'sans-serif',
		},
	}),
];
