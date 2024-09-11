import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import AddBlogPost from './pages/AddBlogPost.tsx';
import LoginPage from './pages/Login.tsx';
import BlogPostPage from './pages/BlogPostPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import PrivateBlogPage from './pages/PrivateBlogPage.tsx';
import DashboardPrivate from './pages/DashboardPrivate.tsx';
import SearchPage from './pages/Search.tsx';

const router = createBrowserRouter([
  { path: "/", element: <App />,},
  { path: "/add-post", element: <AddBlogPost/>,},
  { path: "/login", element: <LoginPage />,},
  { path: "/blog-post", element: <BlogPostPage />,},
  { path: "/dashboard", element: <Dashboard />,},
  { path: "/post/:id", element: <BlogPostPage />,},
  { path: "/private-dashboard", element: <DashboardPrivate />,},
  { path: "/private-post/:id", element: <PrivateBlogPage/>,},
  { path: "/search", element: <SearchPage/>,},
  ]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} /> 
  </StrictMode>,
)
