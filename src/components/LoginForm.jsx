import { useState } from 'react';

function LoginForm({ onLogin }) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      onLogin(nickname);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-300">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl mb-3 text-center text-gray-800">Welcome <br />to <br /> I-transition Presentation Board</h1>
        <label htmlFor="nickname" className="block text-xl font-medium text-gray-700 mb-2">
          Enter your nickname to continue
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Jane Doe"
        />
        <button type="submit" className="w-full mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
          Enter
        </button>
      </form>
    </div>
  );
}
export default LoginForm;