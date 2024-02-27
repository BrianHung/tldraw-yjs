import { BaseBoxShapeUtil, HTMLContainer, Rectangle2d, useValue } from '@tldraw/tldraw';
import { TLTextBlockShape, TextBlockShapeProps } from './TLTextBlockShape';
import { TextBlock } from './TextBlock.tsx';

export class TextBlockShapeUtil extends BaseBoxShapeUtil<TLTextBlockShape> {
	static override type = 'textblock' as const;
	static override props = TextBlockShapeProps;
	canEdit = () => true;
	canScroll = () => true;
	hideRotateHandle = () => true;
	onRotate = (shape: TLTextBlockShape) => shape;

	getDefaultProps(): TLTextBlockShape['props'] {
		return {
			text: '',
			w: 256,
			h: 256,
		};
	}

	getGeometry(shape: TLTextBlockShape) {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		});
	}

	component(shape: TLTextBlockShape) {
		const editor = this.editor;
		const id = shape.id;

		const bounds = this.editor.getShapeGeometry(shape).bounds;
		const isEditing = useValue('isEditing', () => editor.getEditingShapeId() === id, [editor, id]);

		return (
			<HTMLContainer style={{ pointerEvents: isEditing ? 'all' : 'none', width: bounds.w, height: bounds.h }}>
				<TextBlock
					id={shape.id}
					autoFocus={isEditing}
				/>
			</HTMLContainer>
		);
	}

	indicator(shape: TLTextBlockShape) {
		return (
			<rect
				width={shape.props.w}
				height={shape.props.h}
			/>
		);
	}
}
