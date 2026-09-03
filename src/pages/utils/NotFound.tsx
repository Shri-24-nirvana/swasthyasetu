import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-50 p-4 text-center">
      <h1 className="text-6xl font-bold text-brand-700">404</h1>
      <p className="mt-2 text-lg text-fg">Page not found</p>
      <Link to="/login" className="mt-6">
        <Button>Go to Login</Button>
      </Link>
    </div>
  );
}