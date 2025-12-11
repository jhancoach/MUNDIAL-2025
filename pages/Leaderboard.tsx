import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardData, TeamStats } from '../types';
import { calculateTeamStats } from '../services/dataService';
import { Trophy, Crosshair, Crown } from 'lucide-react';
import FilterBar from '../components/FilterBar';

interface LeaderboardProps {
  data: DashboardData;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState<TeamStats[]>([]);

  // Filters State
  const [filters, setFilters] = React.useState<{
    team: string;
    players: string[];
    weapon: string;
    safe: string;
    map: string;
    round: string;
    confrontation: string;
  }>({
    team: 'All', players: [], weapon: 'All', safe: 'All', map: 'All', round: 'All', confrontation: 'All'
  });

  const filterOptions = useMemo(() => ({
    teams: Array.from(new Set(data.details.map(d => d.TIME))).filter(Boolean).sort(),
    players: [], // Not relevant for team leaderboard
    weapons: [], // Not relevant
    safes: [], // Not relevant
    maps: Array.from(new Set(data.details.map(d => d.MAPA))).filter(Boolean).sort(),
    rounds: Array.from(new Set(data.details.map(d => d.RD))).filter(Boolean).sort(),
    confrontations: Array.from(new Set(data.details.map(d => d.CONFRONTO))).filter(Boolean).sort(),
  }), [data.details]);

  React.useEffect(() => {
    if (!data.loading) {
      // Create a shallow copy of data to filter detail rows before calculating
      const filteredDetails = data.details.filter(d => {
        if (filters.team !== 'All' && d.TIME !== filters.team) return false;
        if (filters.map !== 'All' && d.MAPA !== filters.map) return false;
        if (filters.round !== 'All' && d.RD !== filters.round) return false;
        if (filters.confrontation !== 'All' && d.CONFRONTO !== filters.confrontation) return false;
        return true;
      });

      const filteredData = { ...data, details: filteredDetails };
      setStats(calculateTeamStats(filteredData));
    }
  }, [data, filters]);

  const handleTeamClick = (teamName: string) => {
      navigate('/teams', { state: { team: teamName } });
  };

  if (data.loading) return <div className="text-center py-20 text-purple-400 animate-pulse">Carregando classificação...</div>;

  // Top 3 for Cards
  const topBooyahs = [...stats].sort((a, b) => b.b - a.b || b.pts - a.pts).slice(0, 3);
  const topPtsc = [...stats].sort((a, b) => b.ptsc - a.ptsc || b.pts - a.pts).slice(0, 3);
  const topAbts = [...stats].sort((a, b) => b.abts - a.abts || b.pts - a.pts).slice(0, 3);

  const Top3Card = ({ title, icon, teams, metricKey, metricLabel, colorClass }: { title: string, icon: React.ReactNode, teams: TeamStats[], metricKey: keyof TeamStats, metricLabel: string, colorClass: string }) => (
    <div className="bg-[#2D2D2D] rounded-2xl p-6 border border-gray-700/50 relative overflow-hidden group hover:border-gray-600 transition-all">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
        <span className={colorClass}>{icon}</span> {title}
      </h3>
      <div className="space-y-4">
        {teams.map((team, idx) => (
          <div 
            key={team.name} 
            onClick={() => handleTeamClick(team.name)}
            className="flex items-center justify-between bg-[#1E1E1E] p-3 rounded-xl border border-gray-800 cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : 'bg-orange-700 text-white'}`}>
                {idx + 1}
              </div>
              <div className="flex items-center gap-2">
                 {team.image ? (
                    <img src={team.image} alt={team.name} className="w-8 h-8 rounded-full object-cover bg-black" />
                 ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300">
                        {team.name.substring(0,2)}
                    </div>
                 )}
                 <span className="font-semibold text-gray-200 text-sm hover:underline hover:text-purple-400">{team.name}</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`block font-bold text-lg ${colorClass}`}>{team[metricKey]}</span>
              <span className="text-[10px] text-gray-500 uppercase">{metricLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <FilterBar filters={filters} setFilters={setFilters} options={filterOptions} />

      {/* Top 3 Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Top3Card 
          title="Top 3 Booyahs" 
          icon={<Trophy size={24} />} 
          teams={topBooyahs} 
          metricKey="b" 
          metricLabel="Vitórias"
          colorClass="text-yellow-500"
        />
        <Top3Card 
          title="Top 3 PTS/C" 
          icon={<Crown size={24} />} 
          teams={topPtsc} 
          metricKey="ptsc" 
          metricLabel="Pts Colocação"
          colorClass="text-purple-400"
        />
        <Top3Card 
          title="Top 3 Abates" 
          icon={<Crosshair size={24} />} 
          teams={topAbts} 
          metricKey="abts" 
          metricLabel="Abates"
          colorClass="text-red-400"
        />
      </div>

      {/* Main Leaderboard Table */}
      <div className="bg-[#2D2D2D] rounded-2xl overflow-hidden border border-gray-700/50 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-[#262626] text-gray-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-4 text-center">#</th>
                <th className="px-4 py-4">Equipe</th>
                <th className="px-4 py-4 text-center bg-purple-900/10 border-l border-r border-gray-700 text-white font-bold">PTS</th>
                <th className="px-4 py-4 text-center text-purple-300">PTSC</th>
                <th className="px-4 py-4 text-center text-red-300">ABTS</th>
                <th className="px-4 py-4 text-center text-yellow-500">B</th>
                <th className="px-4 py-4 text-center text-gray-300">S</th>
                <th className="px-4 py-4 text-center text-gray-400">Média Abates</th>
                <th className="px-4 py-4 text-center text-gray-400">Média Pts</th>
                <th className="px-4 py-4 text-center text-gray-400">Média PTSC</th>
                <th className="px-4 py-4 text-center text-gray-500">% Pts Pos</th>
                <th className="px-4 py-4 text-center text-gray-500">% Abates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50 text-sm">
              {stats.map((team, index) => (
                <tr 
                    key={team.name} 
                    onClick={() => handleTeamClick(team.name)}
                    className="hover:bg-purple-900/20 transition-colors group cursor-pointer"
                >
                  <td className="px-4 py-3 text-center font-mono text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 font-bold text-white">
                    <div className="flex items-center gap-3">
                        {team.image ? (
                            <img src={team.image} alt={team.name} className="w-10 h-10 rounded-lg object-contain bg-black/20 p-1" />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
                                {team.name.substring(0,2)}
                            </div>
                        )}
                        <span className="group-hover:text-purple-400 transition-colors group-hover:underline decoration-purple-500/50 underline-offset-4">{team.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-white text-lg bg-purple-900/10 border-l border-r border-gray-700/50 group-hover:bg-purple-900/20">
                    {team.pts}
                  </td>
                  <td className="px-4 py-3 text-center text-purple-300">{team.ptsc}</td>
                  <td className="px-4 py-3 text-center text-red-300">{team.abts}</td>
                  <td className="px-4 py-3 text-center text-yellow-500 font-bold">{team.b}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{team.s}</td>
                  
                  <td className="px-4 py-3 text-center text-gray-400">{team.avgAbts}</td>
                  <td className="px-4 py-3 text-center text-gray-400">{team.avgPts}</td>
                  <td className="px-4 py-3 text-center text-gray-400">{team.avgPtsc}</td>

                  <td className="px-4 py-3 text-center text-gray-500">
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded">{team.percentPos}%</span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded">{team.percentAbts}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;