import './App.css';
import { AuthProvider } from '@/context/AuthContext';
import { MainDashboard } from '@/components/DashBoard';

const App = () => {
  return (
    <AuthProvider>
      <MainDashboard />
    </AuthProvider>
  );
};

export default App;
