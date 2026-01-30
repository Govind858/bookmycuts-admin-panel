// Header.tsx
import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} className="text-gray-700" />
          </button>

          <h1 className="text-xl font-bold sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BookMyCuts Admin
          </h1>
        </div>

        {/* You can add user menu, notifications, etc. here later */}
      </div>
    </header>
  );
};

export default Header;