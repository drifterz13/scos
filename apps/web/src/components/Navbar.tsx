import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "Orders" },
  { path: "/warehouses", label: "Warehouses" },
];

export function Navbar() {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-yellow-400 font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-black">SCOS</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"}
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
