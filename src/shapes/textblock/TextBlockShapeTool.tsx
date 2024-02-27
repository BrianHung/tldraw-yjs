import { BaseBoxShapeTool } from '@tldraw/tldraw';

export class TextBlockShapeTool extends BaseBoxShapeTool {
	static override id = 'textblock';
	static override initial = 'idle';
	override shapeType = 'textblock';
}
