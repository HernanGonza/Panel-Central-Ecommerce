import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="font-display text-5xl font-semibold text-foreground">404</p>
      <p className="text-sm text-muted-foreground">No encontramos esta página.</p>
      <Button asChild size="sm">
        <Link to="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
