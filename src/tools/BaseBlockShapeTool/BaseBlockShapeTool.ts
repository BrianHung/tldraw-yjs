import { StateNode } from '@tldraw/tldraw';
import { TLShape } from '@tldraw/tlschema';
import { Idle } from './children/Idle';
import { Pointing } from './children/Pointing';

/**
 * Forked version which selects and edit on create.
 * https://github.com/tldraw/tldraw/tree/main/packages/editor/src/lib/editor/tools/BaseBoxShapeTool
 * @public
 */
export abstract class BaseBlockShapeTool extends StateNode {
	static override id = 'block';
	static override initial = 'idle';
	static override children = () => [Idle, Pointing];

	abstract override shapeType: string;

	onCreate?: (_shape: TLShape | null) => void | null;
}
