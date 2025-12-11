import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, Skull, RefreshCw, Menu, X, Printer, FileText, Download } from 'lucide-react';
import { CSV_URLS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  onRefresh: () => void;
  loading: boolean;
  lastUpdated: Date | null;
}

const Layout: React.FC<LayoutProps> = ({ children, onRefresh, loading, lastUpdated }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Classificação', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Jogadores', path: '/players', icon: <Users size={20} /> },
    { name: 'Times', path: '/teams', icon: <Shield size={20} /> },
    { name: 'Killfeed', path: '/killfeed', icon: <Skull size={20} /> },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
      // Create a temporary link to download the main details CSV
      const link = document.createElement('a');
      link.href = CSV_URLS.fDetalhes;
      link.setAttribute('download', 'Mundial2025_Dados.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("Download iniciado para os dados principais.");
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#2D2D2D] border-b border-gray-700 sticky top-0 z-50 shadow-lg no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 tracking-wider">
                  MUNDIAL 2025
                </h1>
                <p className="text-xs text-gray-400">DASHBOARD COMPETITIVO</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
               {/* Last Updated Text (Hidden on small screens) */}
               {lastUpdated && (
                <span className="text-xs text-gray-500 hidden xl:block">
                  {lastUpdated.toLocaleTimeString()}
                </span>
              )}

              {/* Tools Group */}
              <div className="flex items-center bg-[#1E1E1E] rounded-lg border border-gray-700 p-1">
                  <button
                    onClick={handlePrint}
                    title="Imprimir / Salvar PDF / Gerar Relatório"
                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <Printer size={18} />
                  </button>
                  <div className="w-px h-4 bg-gray-700 mx-1"></div>
                  <button
                    onClick={handleExportCSV}
                    title="Baixar Dados (CSV)"
                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <Download size={18} />
                  </button>
              </div>

              <button
                onClick={onRefresh}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium text-sm transition-all shadow-lg shadow-purple-900/50 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{loading ? '...' : 'Atualizar'}</span>
              </button>

              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-300 hover:text-white p-2"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#262626] border-b border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-gray-700 mt-2 flex gap-2 px-3">
                  <button 
                    onClick={handlePrint}
                    className="flex-1 flex justify-center items-center gap-2 py-2 bg-gray-700 rounded-lg text-sm font-bold"
                  >
                      <Printer size={16}/> Relatório
                  </button>
                  <button 
                    onClick={handleExportCSV}
                    className="flex-1 flex justify-center items-center gap-2 py-2 bg-gray-700 rounded-lg text-sm font-bold"
                  >
                      <Download size={16}/> Dados
                  </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;