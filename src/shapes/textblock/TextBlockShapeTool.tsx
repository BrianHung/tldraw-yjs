import { TLShape } from '@tldraw/tldraw';
import { BaseBlockShapeTool } from '../../tools/BaseBlockShapeTool/BaseBlockShapeTool';

export class TextBlockShapeTool extends BaseBlockShapeTool {
	static override id = 'textblock';
	static override initial = 'idle';
	override shapeType = 'textblock';
	onCreate = (shape: TLShape | null) => {
		if (shape == null) return;
		this.editor.setEditingShape(shape.id);
		this.editor.setCurrentTool('select.editing_shape');
	};
}
