import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard = ({ children, requireAuth = false, redirectTo = '/' }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      // 인증이 필요한 페이지에서 비로그인 상태
      if (requireAuth && !isAuthenticated) {
        navigate('/login');
      }
      // 로그인 페이지에서 이미 로그인 상태
      else if (!requireAuth && isAuthenticated) {
        navigate(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, navigate, requireAuth, redirectTo]);

  // 로딩 중에는 아무것도 렌더링하지 않음
  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}; 