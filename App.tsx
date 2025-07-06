
import React, { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useRouter } from './contexts/RouterContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import ProfileSetup from './components/ProfileSetup';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import LoadingSpinner from './components/LoadingSpinner';
import WorkoutSession from './components/WorkoutSession';

const DashboardPage: React.FC = () => (
  <div className="min-h-screen bg-light-primary dark:bg-dark-primary text-text-dark-primary dark:text-text-light-primary transition-colors duration-300">
    <Header />
    <main className="container mx-auto p-4 md:p-8">
      <Dashboard />
    </main>
  </div>
);

const App: React.FC = () => {
  const { currentUser, isInitialized } = useAuth();
  const { route, navigate } = useRouter();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (currentUser?.settings?.theme) {
      root.classList.add(currentUser.settings.theme);
    } else {
      root.classList.add('dark'); // Default theme
    }
  }, [currentUser]);
  
  useEffect(() => {
    if (!isInitialized) return;

    const publicRoutes = ['/', '/login', '/register'];
    const isPublic = publicRoutes.includes(route);

    if (!currentUser && !isPublic) {
        navigate('/login');
    }
    if(currentUser && isPublic) {
        navigate('/dashboard');
    }
    if(currentUser && !currentUser.isProfileComplete && route !== '/setup-profile') {
        navigate('/setup-profile');
    }
     if(currentUser && currentUser.isProfileComplete && (route === '/setup-profile' || route === '/')) {
        navigate('/dashboard');
    }

  }, [route, currentUser, isInitialized, navigate]);


  if (!isInitialized) {
    return (
        <div className="fixed inset-0 bg-dark-primary flex items-center justify-center">
            <LoadingSpinner />
        </div>
    );
  }

  switch (route) {
    case '/':
      return <LandingPage />;
    case '/login':
        return <LoginPage />;
    case '/register':
        return <RegisterPage />;
    case '/dashboard':
      return currentUser ? <DashboardPage /> : null;
    case '/setup-profile':
      return currentUser ? <ProfileSetup /> : null;
    case '/workout-session':
      return currentUser ? <WorkoutSession /> : null;
    default:
      return <LandingPage />;
  }
};

export default App;