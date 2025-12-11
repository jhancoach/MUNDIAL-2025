import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, Skull, RefreshCw, Menu, X, Printer, Download } from 'lucide-react';
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
      const link = document.createElement('a');
      link.href = CSV_URLS.fDetalhes;
      link.setAttribute('download', 'Mundial2025_Dados.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("Download iniciado para os dados principais.");
  };

  return (
    <div className="min-h-screen text-gray-100 flex flex-col bg-transparent">
      {/* Navbar with Glassmorphism */}
      <nav className="glass sticky top-0 z-50 border-b border-white/5 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo Section */}
            <div className="flex items-center gap-4 group cursor-default">
              <div className="relative">
                 <div className="absolute inset-0 bg-purple-600 rounded-xl blur opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="relative bg-[#0f0f11] p-2.5 rounded-xl border border-white/10">
                    <Shield className="text-purple-400" size={26} />
                 </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-gray-400 tracking-wider font-display leading-none">
                  MUNDIAL 2025
                </h1>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-[10px] text-purple-400 font-semibold tracking-widest uppercase">Dashboard Competitivo</p>
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1 bg-[#0f0f11]/50 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 font-display uppercase tracking-wide ${
                      isActive
                        ? 'bg-purple-600/90 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
               {/* Last Updated */}
               {lastUpdated && (
                <div className="hidden xl:flex flex-col items-end mr-2">
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Última Atualização</span>
                    <span className="text-xs text-purple-300 font-mono">{lastUpdated.toLocaleTimeString()}</span>
                </div>
              )}

              {/* Tools Group */}
              <div className="flex items-center bg-[#0f0f11]/80 rounded-xl border border-white/10 p-1">
                  <button
                    onClick={handlePrint}
                    title="Imprimir / Relatório"
                    className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Printer size={18} />
                  </button>
                  <div className="w-px h-4 bg-white/10 mx-1"></div>
                  <button
                    onClick={handleExportCSV}
                    title="Baixar Dados"
                    className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Download size={18} />
                  </button>
              </div>

              <button
                onClick={onRefresh}
                disabled={loading}
                className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] border border-white/10 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline font-display uppercase tracking-wide">{loading ? '...' : 'Atualizar'}</span>
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
          <div className="md:hidden bg-[#0f0f11] border-b border-gray-800 animate-in slide-in-from-top-2">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 block px-4 py-3 rounded-lg text-base font-bold font-display uppercase ${
                      isActive
                        ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-gray-800 mt-2 flex gap-3 px-3">
                  <button 
                    onClick={handlePrint}
                    className="flex-1 flex justify-center items-center gap-2 py-3 bg-gray-800 rounded-lg text-sm font-bold text-gray-300"
                  >
                      <Printer size={18}/> Relatório
                  </button>
                  <button 
                    onClick={handleExportCSV}
                    className="flex-1 flex justify-center items-center gap-2 py-3 bg-gray-800 rounded-lg text-sm font-bold text-gray-300"
                  >
                      <Download size={18}/> Dados
                  </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-6 mt-8 bg-black/20 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-xs font-mono">
            &copy; 2025 MUNDIAL FREE FIRE DASHBOARD. POWERED BY GOOGLE SHEETS & REACT.
        </div>
      </footer>
    </div>
  );
};

export default Layout;