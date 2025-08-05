import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PresentationPage from './pages/PresentationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/presentation/:id" element={<PresentationPage />} />
      </Routes>
    </Router>
  );
}

export default App;