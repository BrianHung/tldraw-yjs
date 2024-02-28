import { TLShape } from '@tldraw/tldraw';
import { BaseBlockShapeTool } from '../../tools/BaseBlockShapeTool/BaseBlockShapeTool';

export class CodeBlockShapeTool extends BaseBlockShapeTool {
	static override id = 'codeblock';
	static override initial = 'idle';
	override shapeType = 'codeblock';
	onCreate = (shape: TLShape | null) => {
		if (shape == null) return;
		this.editor.setEditingShape(shape.id);
		this.editor.setCurrentTool('select.editing_shape');
	};
}
