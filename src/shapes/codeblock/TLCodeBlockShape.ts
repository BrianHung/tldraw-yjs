/**
 * https://github.com/tldraw/tldraw/blob/main/packages/tlschema/src/shapes/TLTextShape.ts
 */

import { ShapeProps, TLBaseShape } from '@tldraw/tldraw';
import { T } from '@tldraw/validate';

export type TLCodeBlockShapeProps = {
	code: string;
	codeLanguage: string;
	w: number;
	h: number;
};

export type TLCodeBlockShape = TLBaseShape<'codeblock', TLCodeBlockShapeProps>;

export const CodeBlockShapeProps: ShapeProps<TLCodeBlockShape> = {
	code: T.string,
	codeLanguage: T.string,
	w: T.nonZeroNumber,
	h: T.nonZeroNumber,
};
