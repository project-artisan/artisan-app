import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Github} from "lucide-react"
import {Separator} from "@/components/ui/separator"
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleGithubLogin = () => {
    const githubClientId = import.meta.env.VITE_APP_GITHUB_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_APP_GITHUB_REDIRECT_URL;

    window.location.href = `${import.meta.env.VITE_APP_GITHUB_AUTH_URL}?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=user:email`;
  }

  const handleLoginSuccess = () => {
    // 로그인 성공 시 원래 가려던 페이지로 이동
    navigate(from, { replace: true });
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in to Project Artisan using GitHub
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button 
            variant="outline" 
            onClick={handleGithubLogin}
            className="w-full"
          >
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}