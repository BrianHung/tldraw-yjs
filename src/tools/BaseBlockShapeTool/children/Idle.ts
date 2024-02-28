import { StateNode, TLEventHandlers } from '@tldraw/tldraw';

export class Idle extends StateNode {
	static override id = 'idle';

	override onPointerDown: TLEventHandlers['onPointerDown'] = info => {
		this.parent.transition('pointing', info);
	};

	override onEnter = () => {
		this.editor.setCursor({ type: 'cross', rotation: 0 });
	};

	override onCancel = () => {
		this.editor.setCurrentTool('select');
	};
}
