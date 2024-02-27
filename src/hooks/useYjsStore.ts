/**
 * Source code:
 * https://github.com/tldraw/tldraw-yjs-example/blob/main/src/useYjsStore.ts
 */

import {
	InstancePresenceRecordType,
	TLAnyShapeUtilConstructor,
	TLInstancePresence,
	TLRecord,
	TLStoreWithStatus,
	computed,
	createPresenceStateDerivation,
	createTLStore,
	defaultShapeUtils,
	defaultUserPreferences,
	getUserPreferences,
	react,
	setUserPreferences,
	transact,
} from '@tldraw/tldraw';
import { useEffect, useState } from 'react';
import { YKeyValue } from 'y-utility/y-keyvalue';
import * as Y from 'yjs';
import { useYjs } from './useYjs';

export function useYjsStore({
	shapeUtils = [],
}: Partial<{
	version: number;
	shapeUtils: TLAnyShapeUtilConstructor[];
}>) {
	const [store] = useState(() =>
		createTLStore({
			shapeUtils: [...defaultShapeUtils, ...shapeUtils],
		})
	);

	const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
		status: 'loading',
	});

	const { ystore, ydoc, provider } = useYjs(
		({ ydoc, provider, roomId }) => ({
			ystore: new YKeyValue(ydoc.get(`canvas/${roomId}`, Y.Array)),
			ydoc,
			provider,
			roomId,
		}),
		[]
	);

	useEffect(() => {
		setStoreWithStatus({ status: 'loading' });

		const unsubs: (() => void)[] = [];

		function handleSync() {
			// 1.
			// Connect store to yjs store and vis versa, for both the document and awareness

			/* -------------------- Document -------------------- */

			// Sync store changes to the yjs doc
			unsubs.push(
				store.listen(
					function syncStoreChangesToYjsDoc({ changes }) {
						ydoc.transact(() => {
							Object.values(changes.added).forEach(record => {
								ystore.set(record.id, record);
							});

							Object.values(changes.updated).forEach(([_, record]) => {
								ystore.set(record.id, record);
							});

							Object.values(changes.removed).forEach(record => {
								ystore.delete(record.id);
							});
						});
					},
					{ source: 'user', scope: 'document' } // only sync user's document changes
				)
			);

			// Sync the yjs doc changes to the store
			const handleChange = (
				changes: Map<
					string,
					| { action: 'delete'; oldValue: TLRecord }
					| { action: 'update'; oldValue: TLRecord; newValue: TLRecord }
					| { action: 'add'; newValue: TLRecord }
				>,
				transaction: Y.Transaction
			) => {
				if (transaction.local) return;

				const toRemove: TLRecord['id'][] = [];
				const toPut: TLRecord[] = [];

				changes.forEach((change, id) => {
					switch (change.action) {
						case 'add':
						case 'update': {
							const record = ystore.get(id)!;
							toPut.push(record);
							break;
						}
						case 'delete': {
							toRemove.push(id as TLRecord['id']);
							break;
						}
					}
				});

				// put / remove the records in the store
				store.mergeRemoteChanges(() => {
					if (toRemove.length) store.remove(toRemove);
					if (toPut.length) store.put(toPut);
				});
			};

			ystore.on('change', handleChange);
			unsubs.push(() => ystore.off('change', handleChange));

			/* -------------------- Awareness ------------------- */

			const yClientId = provider.awareness.clientID.toString();
			setUserPreferences({ id: yClientId });

			const userPreferences = computed<{
				id: string;
				color: string;
				name: string;
			}>('userPreferences', () => {
				const user = getUserPreferences();
				return {
					id: user.id,
					color: user.color ?? defaultUserPreferences.color,
					name: user.name ?? defaultUserPreferences.name,
				};
			});

			// Create the instance presence derivation
			const presenceId = InstancePresenceRecordType.createId(yClientId);
			const presenceDerivation = createPresenceStateDerivation(userPreferences, presenceId)(store);

			// Set our initial presence from the derivation's current value
			// y-codemirror and y-prosemirror use user field to awareness
			const presence = presenceDerivation.get();
			if (presence) {
				provider.awareness.setLocalStateField('presence', presence);
				provider.awareness.setLocalStateField('user', { color: presence.color, name: presence.userName });
			}

			// When the derivation change, sync presence to to yjs awareness
			// y-codemirror and y-prosemirror use user field to awareness
			unsubs.push(
				react('when presence changes', () => {
					const presence = presenceDerivation.get();
					requestAnimationFrame(() => {
						if (presence) {
							provider.awareness.setLocalStateField('presence', presence);
							provider.awareness.setLocalStateField('user', { color: presence.color, name: presence.userName });
						}
					});
				})
			);

			// Sync yjs awareness changes to the store
			const handleUpdate = (update: { added: number[]; updated: number[]; removed: number[] }) => {
				const states = provider.awareness.getStates() as Map<number, { presence: TLInstancePresence }>;

				const toRemove: TLInstancePresence['id'][] = [];
				const toPut: TLInstancePresence[] = [];

				// Connect records to put / remove
				for (const clientId of update.added) {
					const state = states.get(clientId);
					if (state?.presence && state.presence.id !== presenceId) {
						toPut.push(state.presence);
					}
				}

				for (const clientId of update.updated) {
					const state = states.get(clientId);
					if (state?.presence && state.presence.id !== presenceId) {
						toPut.push(state.presence);
					}
				}

				for (const clientId of update.removed) {
					toRemove.push(InstancePresenceRecordType.createId(clientId.toString()));
				}

				// put / remove the records in the store
				store.mergeRemoteChanges(() => {
					if (toRemove.length) store.remove(toRemove);
					if (toPut.length) store.put(toPut);
				});
			};

			provider.awareness.on('update', handleUpdate);
			unsubs.push(() => provider.awareness.off('update', handleUpdate));

			// 2.
			// Initialize the store with the yjs doc records—or, if the yjs doc
			// is empty, initialize the yjs doc with the default store records.
			if (ystore.yarray.length) {
				// Replace the store records with the yjs doc records
				transact(() => {
					// The records here should be compatible with what's in the store
					store.clear();
					const records = ystore.yarray.toJSON().map(({ val }) => val);
					store.put(records);
				});
			} else {
				// Create the initial store records
				// Sync the store records to the yjs doc
				ydoc.transact(() => {
					for (const record of store.allRecords()) {
						ystore.set(record.id, record);
					}
				});
			}

			setStoreWithStatus({
				store,
				status: 'synced-remote',
				connectionStatus: 'online',
			});
		}

		/**
		 * TODO: Refactor this to work with providers other than WebsocketProvider.
		 */
		let hasConnectedBefore = false;
		function handleStatusChange({ status }: { status: 'disconnected' | 'connected' }) {
			// If we're disconnected, set the store status to 'synced-remote' and the connection status to 'offline'
			if (status === 'disconnected') {
				setStoreWithStatus({
					store,
					status: 'synced-remote',
					connectionStatus: 'offline',
				});
				return;
			}

			provider.off('synced', handleSync);

			if (status === 'connected') {
				if (hasConnectedBefore) return;
				hasConnectedBefore = true;
				provider.on('synced', handleSync);
				unsubs.push(() => provider.off('synced', handleSync));
			}
		}

		provider.on('status', handleStatusChange);
		unsubs.push(() => provider.off('status', handleStatusChange));

		return () => {
			unsubs.forEach(fn => fn());
			unsubs.length = 0;
		};
	}, [provider, ydoc, store, ystore]);

	return storeWithStatus;
}
