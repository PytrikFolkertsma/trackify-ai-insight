
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold">Oops! Page not found</h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild size="lg">
          <Link to="/">
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
