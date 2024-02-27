import React from 'react';
import * as Y from 'yjs';

export const YjsContext = React.createContext<YjsContextType | undefined>(undefined);

interface YjsContextType {
	ydoc: Y.Doc;
	provider: any;
	undoManager: Y.UndoManager;
	roomId: string;
}

export const YjsProvider = React.memo(function YjsProvider(
	props: React.PropsWithChildren<{ getProvider: (props: { ydoc: Y.Doc; roomId: string }) => any; roomId: string }>
) {
	const { roomId, getProvider } = props;
	const context = React.useMemo(() => {
		const ydoc = new Y.Doc({ gc: true });
		const provider = getProvider({ ydoc, roomId });
		const undoManager = new Y.UndoManager([], { doc: ydoc });
		return { ydoc, provider, undoManager, roomId };
	}, [roomId, getProvider]);
	return <YjsContext.Provider value={context}>{props.children}</YjsContext.Provider>;
});

/**
 * Creates a Yjs document and provider for a given type and id.
 * @param options
 * @returns
 */
export function useYjs(selector: (context: YjsContextType) => any = x => x, deps: any[] = []) {
	const context = React.useContext(YjsContext);
	if (context === undefined) {
		throw new Error('useYjs must be used within a YjsProvider');
	}
	return React.useMemo(() => selector(context), deps);
}
