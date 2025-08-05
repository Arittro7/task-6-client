import { Link } from 'react-router-dom';

function PresentationList({ presentations, nickname }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {presentations.map(p => (
        <Link 
          to={`/presentation/${p.id}`} 
          state={{ nickname: nickname }} 
          key={p.id}
          className="block bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{p.name}</h3>
          <p className="text-sm text-gray-500">
            Created on: {new Date(p.created_at).toLocaleDateString()}
          </p>
          <div className="mt-4 w-full bg-gray-800 text-white text-center py-2 rounded-md hover:bg-gray-900 transition">
            Join
          </div>
        </Link>
      ))}
    </div>
  );
}

export default PresentationList;