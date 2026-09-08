import { createHashRouter } from 'react-router-dom';
import { App } from '@/app/App';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function createAppRouter() {
  return createHashRouter(
    [
      {
        path: '/',
        element: <App />,
        children: [
          { index: true, element: <HomePage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
    {
      future: {
        v7_relativeSplatPath: true,
      },
    },
  );
}

export const router = createAppRouter();
