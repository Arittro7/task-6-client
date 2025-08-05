import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import Canvas from '../components/Canvas';

const API_URL = 'https://task-6-server.vercel.app';

function PresentationPage() {
  const { id: presentationId } = useParams();
  const location = useLocation();
  
  const [presentation, setPresentation] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [elements, setElements] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const nickname = location.state?.nickname || 'Anonymous';
    const newSocket = io(API_URL, { query: { nickname } });
    setSocket(newSocket);

    newSocket.emit('join_presentation', { presentationId });

    const handleUserUpdate = (userList) => setUsers(userList);
    const handleElementsUpdate = (updatedElements) => setElements(updatedElements);
    const handleNewSlide = (newSlide) => {
      setSlides(prevSlides => [...prevSlides, newSlide].sort((a, b) => a.slide_order - b.slide_order));
    };

    newSocket.on('update_user_list', handleUserUpdate);
    newSocket.on('update_elements', handleElementsUpdate);
    newSocket.on('new_slide_added', handleNewSlide);

    const fetchPresentationData = async () => {
      setLoading(true);
      try {
        const presentationRes = await axios.get(`${API_URL}/api/presentations/${presentationId}`);
        const slidesRes = await axios.get(`${API_URL}/api/presentations/${presentationId}/slides`);
        
        setPresentation(presentationRes.data);
        const sortedSlides = slidesRes.data.sort((a, b) => a.slide_order - b.slide_order);
        setSlides(sortedSlides);
        
        if (sortedSlides.length > 0) {
          const firstSlide = sortedSlides[0];
          setCurrentSlide(firstSlide);
          setElements(firstSlide.content || []);
        }
      } catch (err) {
        setError('Failed to load presentation.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPresentationData();

    return () => {
      newSocket.emit('leave_presentation', { presentationId });
      newSocket.off('update_user_list', handleUserUpdate);
      newSocket.off('update_elements', handleElementsUpdate);
      newSocket.off('new_slide_added', handleNewSlide);
      newSocket.disconnect();
    };
  }, [presentationId, location.state]);

  const broadcastUpdate = (updatedElements) => {
    if (socket && currentSlide) {
      socket.emit('update_elements', { 
        presentationId, 
        slideId: currentSlide.id, 
        elements: updatedElements 
      });
    }
  };

  const addTextElement = () => {
    const newElement = { id: uuidv4(), type: 'text', text: 'Edit me...', x: 100, y: 100 };
    const updatedElements = [...elements, newElement];
    setElements(updatedElements);
    broadcastUpdate(updatedElements);
  };
  
  const updateElement = (elementId, updates) => {
    const updatedElements = elements.map(el => el.id === elementId ? { ...el, ...updates } : el);
    setElements(updatedElements);
    broadcastUpdate(updatedElements);
  };

  const handleNewSlideClick = async () => {
    try {
      const nextSlideOrder = slides.length + 1;
      await axios.post(`${API_URL}/api/presentations/${presentationId}/slides`, {
        slideOrder: nextSlideOrder,
      });
    
    } catch (err) {
      console.error('Failed to create new slide:', err);
    }
  };
  
  const selectSlide = (slide) => {
    setCurrentSlide(slide);
    setElements(slide.content || []);
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-200">
      <header className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white shadow-md z-10">
        <h1 className="text-xl font-semibold">{presentation?.name || 'Loading...'}</h1>
        <div className="flex items-center gap-4">
          <button onClick={addTextElement} className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">Add Text</button>
          <button className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">Present</button>
        </div>
      </header>
      
      <div className="flex flex-grow overflow-hidden">
        <aside className="w-48 bg-gray-100 p-4 overflow-y-auto border-r flex-shrink-0">
          <h2 className="text-lg font-semibold mb-4">Slides</h2>
          <button onClick={handleNewSlideClick} className="w-full py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600">
            + New Slide
          </button>
          {slides.map(slide => (
            <div 
              key={slide.id} 
              className={`border rounded h-24 mb-2 flex items-center justify-center cursor-pointer ${currentSlide?.id === slide.id ? 'border-blue-500 border-2 bg-blue-100' : 'bg-white'}`}
              onClick={() => selectSlide(slide)}
            >
              Slide {slide.slide_order}
            </div>
          ))}
        </aside>
        
        <main className="flex-grow relative">
          <Canvas elements={elements} onUpdateElement={updateElement} />
        </main>
        
        <aside className="w-56 bg-gray-100 p-4 overflow-y-auto border-l flex-shrink-0">
          <h2 className="text-lg font-semibold mb-4">Users ({users.length})</h2>
          <ul>
            {users.map(user => <li key={user.id} className="py-1">{user.nickname}</li>)}
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default PresentationPage;