import React, { Suspense } from 'react';

import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { Toaster } from '@/components/ui/toaster';
import WaitingView from '@/components/WaitingView';
import { AuthProvider } from '@/contexts/auth';
import AuthLayout from '@/layouts/AuthLayout';
import DefaultLayout from '@/layouts/DefaultLayout';
import InterviewLayout from '@/layouts/InterviewLayout';
import NotFoundPage from '@/pages/error/NotFound';
import { AuthGuard } from '@/components/auth/AuthGuard';

// Lazy loading for pages
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const TechBlog = React.lazy(() => import('@/pages/blogs/TechBlog'));
const Companies = React.lazy(() => import('@/pages/blogs/Companies'));
const AllQuestionSets = React.lazy(() => import('@/pages/interview/AllQuestionSets'));
const InterviewResults = React.lazy(() => import('@/pages/interview/Results'));
const InterviewSession = React.lazy(() => import('@/pages/interview/InterviewSession'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const LoginPage = React.lazy(() => import('@/pages/auth/Login'));
const SignupPage = React.lazy(() => import('@/pages/auth/Signup'));
const GithubCallback = React.lazy(() => import('@/pages/auth/GithubCallback'));
const InterviewDetail = React.lazy(() => import('@/pages/interview/InterviewDetail')); const Introductions = React.lazy(() => import('@/pages/Introductions'));

const Root = () => {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<WaitingView />}>
            <DefaultLayout />
          </Suspense>
        ),
        children: [
          { 
            path: 'introductions', 
            element: <Introductions /> 
          },
          { index: true, element: <Introductions/> },
          { path: 'blogs/tech', element: <TechBlog /> },
          { path: 'blogs/companies', element: <Companies /> },
          {
            path: 'interview',
            children: [
              { index: true, element: <AllQuestionSets /> },
              {
                path: 'results',
                element: (
                  <PrivateRoute>
                    <InterviewResults />
                  </PrivateRoute>
                )
              },
              {
                path: ':interviewId/detail',
                element: (
                  <PrivateRoute>
                    <InterviewDetail />
                  </PrivateRoute>
                )
              }
            ]
          },
          {
            path: 'settings',
            element: (
              <AuthGuard requireAuth>
                <Settings />
              </AuthGuard>
            )
          }
        ]
      },
      {
        path: '/',
        element: (
          <Suspense fallback={<WaitingView />}>
            <AuthLayout />
          </Suspense>
        ),
        children: [
          { path: 'login', element: (
            <AuthGuard>
              <LoginPage />
            </AuthGuard>
          ) },
          { path: 'signup', element: <SignupPage /> }
        ]
      },
      {
        path: 'auth/github',
        element: <GithubCallback />
      },
      {
        path: '/interviews/',
        element: (
          <Suspense fallback={<WaitingView />}>
            <PrivateRoute>
              <InterviewLayout />
            </PrivateRoute>
          </Suspense>
        ),
        children: [{ path: ':interviewId', element: <InterviewSession /> }]
      }
    ]
  }
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}

