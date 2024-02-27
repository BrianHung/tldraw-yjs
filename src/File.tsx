import {
	Editor,
	Tldraw,
	TldrawProps,
	createSessionStateSnapshotSignal,
	loadSessionStateSnapshotIntoStore,
	react,
} from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import React from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { WebsocketProvider } from 'y-websocket';
import { useUrlState } from './hooks/useUrlState';
import { YjsProvider } from './hooks/useYjs';
import { useYjsStore } from './hooks/useYjsStore';
import { CodeBlockShapeTool } from './shapes/codeblock/CodeBlockShapeTool';
import { CodeBlockShapeUtil } from './shapes/codeblock/CodeBlockShapeUtil';
import { TextBlockShapeTool } from './shapes/textblock/TextBlockShapeTool';
import { TextBlockShapeUtil } from './shapes/textblock/TextBlockShapeUtil';
import { uiOverrides } from './uiOverrides';

const shapeUtils = [CodeBlockShapeUtil, TextBlockShapeUtil];
const tools = [CodeBlockShapeTool, TextBlockShapeTool];

const serverUrl = import.meta.env.VITE_WS_SERVER_URL;

const getProvider = ({ ydoc, roomId }) => new WebsocketProvider(serverUrl, `${roomId}`, ydoc, { connect: true });

function CanvasWithId() {
	const { user, fileId } = useLoaderData();

	const onMount = React.useCallback(function onMount(editor: Editor) {
		editor.updateInstanceState({ isDebugMode: false });
		editor.user.updateUserPreferences(user);

		const store = editor.store;
		const disposables = new Set<() => void>();

		/**
		 * Persist session state in localStorage.
		 */
		const session = JSON.parse(localStorage.getItem('TLDRAW_INSTANCE_STATE')!);
		if (session) loadSessionStateSnapshotIntoStore(store, session);
		const sessionStateSnapshot = createSessionStateSnapshotSignal(store);
		disposables.add(
			react('when session state changes', function syncSessionStateToLocalStorage() {
				const session = sessionStateSnapshot.get();
				requestAnimationFrame(() => {
					if (session) localStorage.setItem('TLDRAW_INSTANCE_STATE', JSON.stringify(session));
				});
			})
		);

		return () => {
			disposables.forEach(dispose => dispose());
			disposables.clear();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<YjsProvider
			getProvider={getProvider}
			roomId={fileId}
		>
			<div style={{ position: 'fixed', inset: 0 }}>
				<TldrawYjs
					autoFocus
					shapeUtils={shapeUtils}
					tools={tools}
					overrides={uiOverrides}
					onMount={onMount}
				/>
			</div>
		</YjsProvider>
	);
}

const TldrawYjs = React.memo((props: TldrawProps) => {
	const store = useYjsStore({ shapeUtils: props.shapeUtils || [] });
	return (
		<Tldraw
			store={store}
			{...props}
		>
			<UrlState />
		</Tldraw>
	);
});

export default CanvasWithId;

export function UrlState() {
	const navigate = useNavigate();
	const location = useLocation();
	useUrlState(params =>
		navigate({
			pathname: location.pathname,
			search: decodeURIComponent(new URLSearchParams(params).toString()),
		})
	);
	return null;
}
