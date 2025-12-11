import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Leaderboard from './pages/Leaderboard';
import Players from './pages/Players';
import Teams from './pages/Teams';
import KillFeedPage from './pages/KillFeedPage';
import { fetchDashboardData } from './services/dataService';
import { DashboardData } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    players: [],
    killFeed: [],
    details: [],
    characters: [],
    loading: true,
    lastUpdated: null
  });

  const loadData = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true }));
    const newData = await fetchDashboardData();
    setData(newData);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <HashRouter>
      <Layout onRefresh={loadData} loading={data.loading} lastUpdated={data.lastUpdated}>
        <Routes>
          <Route path="/" element={<Leaderboard data={data} />} />
          <Route path="/players" element={<Players data={data} />} />
          <Route path="/teams" element={<Teams data={data} />} />
          <Route path="/killfeed" element={<KillFeedPage data={data} />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;