import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-5xl font-bold text-ink-muted">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-ink-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        Go to home
      </Link>
    </div>
  );
}
