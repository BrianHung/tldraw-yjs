import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import {
	LanguageDescription,
	bracketMatching,
	defaultHighlightStyle,
	foldGutter,
	foldKeymap,
	indentOnInput,
	syntaxHighlighting,
} from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { lintKeymap } from '@codemirror/lint';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { Compartment, EditorState, Extension } from '@codemirror/state';
import {
	EditorView,
	crosshairCursor,
	drawSelection,
	dropCursor,
	highlightActiveLine,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
	lineNumbers,
	placeholder,
	rectangularSelection,
} from '@codemirror/view';

const language = new Compartment();

export function setLanguage(view: EditorView, name: string) {
	const lang =
		LanguageDescription.matchFilename(languages, name) || LanguageDescription.matchLanguageName(languages, name);
	if (lang) {
		lang.load().then(support =>
			view.dispatch({
				effects: language.reconfigure(support),
			})
		);
	}
}

/**
 * https://github.com/codemirror/basic-setup/blob/main/src/codemirror.ts
 */
export const basicSetup: Extension = (() => [
	lineNumbers(),
	highlightActiveLineGutter(),
	highlightSpecialChars(),
	foldGutter(),
	drawSelection(),
	dropCursor(),
	EditorState.allowMultipleSelections.of(true),
	indentOnInput(),
	syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
	bracketMatching(),
	closeBrackets(),
	autocompletion(),
	rectangularSelection(),
	crosshairCursor(),
	highlightActiveLine(),
	highlightSelectionMatches(),
	keymap.of([
		...closeBracketsKeymap,
		...defaultKeymap,
		...searchKeymap,
		...foldKeymap,
		...completionKeymap,
		...lintKeymap,
		indentWithTab,
	]),
	placeholder('Add code'),
	language.of([]),
])();
