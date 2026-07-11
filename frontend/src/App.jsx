import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Budgets from './pages/Budgets.jsx';
import Groups from './pages/Groups.jsx';
import GroupDetail from './pages/GroupDetail.jsx';

const Layout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <main className="flex-1 p-8 max-w-6xl">{children}</main>
  </div>
);

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
    <Route path="/transactions" element={<ProtectedRoute><Layout><Transactions /></Layout></ProtectedRoute>} />
    <Route path="/budgets" element={<ProtectedRoute><Layout><Budgets /></Layout></ProtectedRoute>} />
    <Route path="/groups" element={<ProtectedRoute><Layout><Groups /></Layout></ProtectedRoute>} />
    <Route path="/groups/:id" element={<ProtectedRoute><Layout><GroupDetail /></Layout></ProtectedRoute>} />
  </Routes>
);

export default App;
