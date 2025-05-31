import React, { Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { 
  createBrowserRouter, 
  Navigate, 
  Outlet,
  RouterProvider 
} from 'react-router-dom';
import Landing from '../pages/Landing';
import Header from '../shared/ui/Header';
import Layout from '../shared/ui/Layout';
import { auth } from '../firebase/config';

// Lazy load page components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Subjects = lazy(() => import('../pages/Subjects'));
const SubjectDetail = lazy(() => import('../pages/SubjectDetail'));
const Goals = lazy(() => import('../pages/Goals'));
const Planner = lazy(() => import('../pages/Planner'));
const Profile = lazy(() => import('../pages/Profile'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const UploadGrade = lazy(() => import('../pages/UploadGrade'));
const Subscription = lazy(() => import('../pages/Subscription'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Auth guard
const AuthGuard = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = auth.currentUser !== null;
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

// Loading fallback
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Landing />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: 'subjects',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthGuard>
              <Subjects />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: 'subjects/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthGuard>
              <SubjectDetail />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: 'goals',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthGuard>
              <Goals />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: 'planner',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthGuard>
              <Planner />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthGuard>
              <Profile />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: 'upload',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthGuard>
              <UploadGrade />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: 'subscription',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Subscription />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <Layout showFooter={false} />,
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Register />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router; 