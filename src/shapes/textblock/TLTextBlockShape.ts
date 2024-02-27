/**
 * https://github.com/tldraw/tldraw/blob/main/packages/tlschema/src/shapes/TLTextShape.ts
 */

import { ShapeProps, TLBaseShape } from '@tldraw/tldraw';
import { T } from '@tldraw/validate';

export type TLTextBlockShapeProps = {
	text: string;
	w: number;
	h: number;
};

export type TLTextBlockShape = TLBaseShape<'textblock', TLTextBlockShapeProps>;

export const TextBlockShapeProps: ShapeProps<TLTextBlockShape> = {
	text: T.string,
	w: T.nonZeroNumber,
	h: T.nonZeroNumber,
};
