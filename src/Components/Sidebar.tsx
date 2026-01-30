// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Users, Store, Crown, TrendingUp, ShoppingBag,Book  } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation(); // ← get current route

  const menuItems = [
    { id: 'dashboard', path: '/', label: 'Dashboard', icon: TrendingUp },
    { id: 'shop-owners', path: '/shop-owners', label: 'Shop Owners', icon: Users },
    { id: 'premium-shops', path: '/premium-shops', label: 'All Premium Shops', icon: Crown },
    { id: 'shops', path: '/shops', label: 'Shops', icon: Store },
    { id: 'users', path: '/users', label: 'Users', icon: ShoppingBag },
    { id: 'booking', path: '/bookings', label: 'Bookings', icon: Book },

  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 
          text-white transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 pt-7 lg:pt-6">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                BookMyCuts
              </h2>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                aria-label="Close sidebar"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={onClose} // close sidebar on mobile after click
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-md'
                        : 'hover:bg-slate-700/70'
                      }
                    `}
                  >
                    <Icon 
                      size={20} 
                      className={isActive ? 'text-white' : 'text-slate-300'} 
                    />
                    <span 
                      className={`font-medium ${isActive ? 'text-white' : 'text-slate-200'}`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="mt-auto p-6 pt-4 border-t border-slate-700/50 text-xs text-slate-400">
            Admin v1.0 • {new Date().getFullYear()}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;