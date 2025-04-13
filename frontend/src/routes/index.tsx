import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { TasksPage } from '../pages/TasksPage';
import { TagsPage } from '../pages/TagsPage';
import { ProfilePage } from '../pages/ProfilePage'; // Import ProfilePage
import { PrivateRoute } from '../components/auth/PrivateRoute';
import { Layout } from '../components/layout/Layout'; // Import Layout

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Rotas Privadas dentro do Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              {/* Rota padrão redireciona para /tasks */}
              <Navigate to="/tasks" replace />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <Layout>
              <TasksPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/tags"
        element={
          <PrivateRoute>
            <Layout>
              <TagsPage />
            </Layout>
          </PrivateRoute>
        }
      />
       <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout>
              <ProfilePage /> {/* Adiciona rota do perfil */}
            </Layout>
          </PrivateRoute>
        }
      />

      {/* Fallback para rotas desconhecidas (opcional) */}
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
};