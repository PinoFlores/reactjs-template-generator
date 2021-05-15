import Dashboard from '@pages/Dashboard';

export const BaseRoutes = [
  { exact: true, path: '/', component: <Dashboard /> },
  // Example
  {
    exact: true,
    path: '/page',
    // component: < />,
  },
  {
    exact: true,
    path: '/page/:id',
    // component: < />,
  },
  {
    exact: true,
    path: '/page/new',
    // component: < />,
  },
];
