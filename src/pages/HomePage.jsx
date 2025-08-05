import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import LoginForm from '../components/LoginForm';
import PresentationList from '../components/PresentationList';

const API_URL = 'https://task-6-server.vercel.app';

function HomePage() {
  const [presentations, setPresentations] = useState([]);
  const [nickname, setNickname] = useState('');
  const [presentationName, setPresentationName] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!nickname) return;

    const newSocket = io(API_URL, {
      query: { nickname }
    });
    setSocket(newSocket);
    
    return () => newSocket.disconnect();
  }, [nickname]);
  
  useEffect(() => {
    if (!socket) return;
    
    axios.get(`${API_URL}/api/presentations`)
      .then(response => setPresentations(response.data))
      .catch(error => console.error('Error fetching presentations:', error));
    
    const handleNewPresentation = (newPresentation) => {
      setPresentations(prev => [newPresentation, ...prev]);
    };
    socket.on('new_presentation', handleNewPresentation);

    return () => {
      socket.off('new_presentation', handleNewPresentation);
    };
  }, [socket]);

  const handleLogin = (name) => {
    setNickname(name);
  };

  const handleCreatePresentation = async (e) => {
    e.preventDefault();
    if (presentationName.trim()) {
      try {
        await axios.post(`${API_URL}/api/presentations`, { name: presentationName });
        setPresentationName('');
      } catch (error) {
        console.error('Error creating presentation:', error);
      }
    }
  };

  if (!nickname) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-300 ">
      <div className="container mx-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Presentations</h1>
          <p className="text-gray-600">Welcome, <span className="font-semibold">{nickname}</span></p>
        </header>

        <form onSubmit={handleCreatePresentation} className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Create a New Presentation</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={presentationName}
              onChange={(e) => setPresentationName(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter presentation name..."
            />
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition">
              Create
            </button>
          </div>
        </form>

        <PresentationList presentations={presentations} nickname={nickname} />
      </div>
    </div>
  );
}

export default HomePage;