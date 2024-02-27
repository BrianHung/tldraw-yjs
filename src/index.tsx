import React from 'react';
import ReactDOM from 'react-dom/client';
import { LoaderFunction, RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import './index.css';

import File from './File';
import { getRandomUser } from './utils/getRandomUser';
import { getShortUUID, isShortUUID } from './utils/uuid';

/**
 * Replace in production with user and file authentication.
 */
const checkForUserAndFile: LoaderFunction = ({ params }) => {
	const user = JSON.parse(localStorage.getItem('user')) || getRandomUser();
	localStorage.setItem('user', JSON.stringify(user));
	if (!params.fileId || !isShortUUID(params.fileId as string)) return redirect(`/file/${getShortUUID()}`);
	return {
		user,
		fileId: params.fileId,
	};
};

const router = createBrowserRouter([
	{
		path: '/file/:fileId',
		element: <File />,
		loader: checkForUserAndFile,
	},
	{
		path: '*',
		element: <div></div>,
		loader: () => redirect(`/file/${getShortUUID()}`),
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
