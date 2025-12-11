import React from 'react';
import { Shield, Zap } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#050505] to-[#050505]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
      
      <div className="relative z-10 flex flex-col items-center animate-float">
        {/* Logo Container */}
        <div className="relative mb-8">
            <div className="absolute -inset-4 bg-purple-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-[#1a103c] to-[#000] p-6 rounded-2xl border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                <Shield size={64} className="text-purple-400" />
                <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-1.5 border-4 border-[#050505]">
                    <Zap size={16} className="text-white" fill="white"/>
                </div>
            </div>
        </div>

        {/* Text */}
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-gray-400 tracking-wider font-display mb-2 drop-shadow-lg">
          MUNDIAL 2025
        </h1>
        <p className="text-purple-400 tracking-[0.3em] text-sm md:text-base font-semibold uppercase opacity-80">
          Dashboard Competitivo
        </p>
      </div>

      {/* Loading Bar */}
      <div className="relative z-10 mt-12 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1/2 bg-purple-500 shadow-[0_0_10px_#a855f7] animate-[shimmer_1.5s_infinite_linear]"></div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 font-mono animate-pulse">
        CARREGANDO DADOS...
      </div>

      <style>{`
        @keyframes shimmer {
          0% { left: -50%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
