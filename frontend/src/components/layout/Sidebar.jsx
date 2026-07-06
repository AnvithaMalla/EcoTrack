import { NavLink } from 'react-router-dom';
import { FiBarChart2, FiClipboard, FiGift, FiHome, FiLogOut, FiSettings, FiStar, FiTrendingUp, FiUser } from 'react-icons/fi';
import { Button } from '../ui/Button';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/logger', label: 'Habit Logger', icon: FiClipboard },
  { to: '/suggestions', label: 'Suggestions', icon: FiStar },
  { to: '/history', label: 'History', icon: FiBarChart2 },
  { to: '/badges', label: 'Badges', icon: FiGift },
  { to: '/profile', label: 'Profile', icon: FiUser },
];

export const Sidebar = ({ onLogout, mobile = false }) => (
  <aside className={`${mobile ? 'flex h-full w-full flex-col bg-white p-5 dark:bg-ink-950' : 'hidden h-screen w-72 shrink-0 border-r border-white/50 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/70 lg:flex lg:flex-col'}`}>
    <div className="mb-8 grid gap-2">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-mint-500 to-sand-500 text-lg font-black text-white shadow-glow">E</div>
        <div>
          <div className="text-lg font-semibold text-ink-900 dark:text-white">EcoTrack</div>
          <div className="text-xs text-ink-500 dark:text-ink-300">Carbon dashboard</div>
        </div>
      </div>
    </div>
    <nav className="grid gap-2">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-mint-500 text-white shadow-glow' : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800'}`
          }
        >
          <Icon className="text-base" />
          {label}
        </NavLink>
      ))}
    </nav>
    <div className="mt-auto grid gap-3 pt-6">
      <div className="rounded-3xl bg-gradient-to-br from-ink-900 to-mint-900 p-4 text-white shadow-xl">
        <div className="text-xs uppercase tracking-[0.25em] text-white/60">Tip</div>
        <p className="mt-2 text-sm leading-6 text-white/85">Log daily activity consistently to unlock streaks, badges, and more accurate suggestions.</p>
      </div>
      <Button variant="secondary" onClick={onLogout} className="justify-start">
        <FiLogOut /> Logout
      </Button>
    </div>
  </aside>
);
