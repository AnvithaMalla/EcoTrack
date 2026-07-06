import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="grid max-w-xl gap-6 text-center">
        <div className="text-6xl font-black text-mint-500">404</div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900 dark:text-white">Page not found</h1>
        <p className="text-sm leading-6 text-ink-600 dark:text-ink-300">The page you requested does not exist or has moved.</p>
        <Button as={Link} to="/dashboard">Go to dashboard</Button>
      </div>
    </div>
  );
}
