import { BaseBoxShapeUtil, HTMLContainer, Rectangle2d, useValue } from '@tldraw/tldraw';
import { CodeBlock } from './CodeBlock.tsx';
import { CodeBlockShapeProps, TLCodeBlockShape } from './TLCodeBlockShape';

export class CodeBlockShapeUtil extends BaseBoxShapeUtil<TLCodeBlockShape> {
	static override type = 'codeblock' as const;
	static override props = CodeBlockShapeProps;

	canEdit = () => true;
	canScroll = () => true;
	hideRotateHandle = () => true;
	onRotate = (shape: TLCodeBlockShape) => shape;

	getDefaultProps(): TLCodeBlockShape['props'] {
		return {
			code: '',
			codeLanguage: 'javascript',
			w: 512 + 32,
			h: 128 + 8 + 4,
		};
	}

	getGeometry(shape: TLCodeBlockShape) {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		});
	}

	component(shape: TLCodeBlockShape) {
		const editor = this.editor;
		const id = shape.id;

		const bounds = this.editor.getShapeGeometry(shape).bounds;
		const isEditing = useValue('isEditing', () => editor.getEditingShapeId() === id, [editor, id]);

		return (
			<HTMLContainer style={{ pointerEvents: isEditing ? 'all' : 'none', width: bounds.w, height: bounds.h }}>
				<CodeBlock
					id={shape.id}
					autoFocus={isEditing}
				/>
			</HTMLContainer>
		);
	}

	indicator(shape: TLCodeBlockShape) {
		return (
			<rect
				width={shape.props.w}
				height={shape.props.h}
			/>
		);
	}
}
