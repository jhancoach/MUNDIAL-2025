import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Leaderboard from './pages/Leaderboard';
import Players from './pages/Players';
import Teams from './pages/Teams';
import KillFeedPage from './pages/KillFeedPage';
import SplashScreen from './components/SplashScreen';
import { fetchDashboardData } from './services/dataService';
import { DashboardData } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    players: [],
    killFeed: [],
    details: [],
    characters: [],
    teamsReference: [],
    weapons: [],
    weaponTypes: [],
    safes: [],
    hab1: [],
    hab2: [],
    hab3: [],
    hab4: [],
    pets: [],
    items: [],
    loading: true,
    lastUpdated: null
  });

  const [showSplash, setShowSplash] = useState(true);

  const loadData = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true }));
    
    // Fetch data
    const newData = await fetchDashboardData();
    
    // Ensure splash screen shows for at least a few seconds for effect
    // In a real app, you might only wait for data, but for "Premium feel", a slight pause helps set the mood
    setTimeout(() => {
        setData(newData);
        setShowSplash(false);
    }, 2500);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (showSplash) {
      return <SplashScreen />;
  }

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