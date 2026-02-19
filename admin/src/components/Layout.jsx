import { Outlet, NavLink } from "react-router-dom";

const nav = [
  { to: "/regions", label: "Regions" },
  { to: "/states", label: "States" },
  { to: "/destinations", label: "Destinations" },
  { to: "/packages", label: "Packages" },
  { to: "/bookings", label: "Bookings" },
  { to: "/users", label: "Users" },
  { to: "/newsletter", label: "Newsletter" },
];

export default function Layout() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded ${isActive ? "bg-saffron text-white" : "text-navy hover:bg-slate-100"}`;

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-navy text-white shrink-0">
        <div className="p-4 font-bold text-saffron">Incredible India Admin</div>
        <nav className="p-2 space-y-1">
          {nav.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-saffron" : "hover:bg-white/10"}`}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-slate-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
