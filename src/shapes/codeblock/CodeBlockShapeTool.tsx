import { BaseBoxShapeTool } from '@tldraw/tldraw';

export class CodeBlockShapeTool extends BaseBoxShapeTool {
	static override id = 'codeblock';
	static override initial = 'idle';
	override shapeType = 'codeblock';
}
