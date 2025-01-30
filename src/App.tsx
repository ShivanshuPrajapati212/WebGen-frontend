import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, ArrowRight, Github } from 'lucide-react';

function App() {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use navigate with state instead of URL parameters
    navigate('/preview', { state: { prompt } });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Terminal className="w-8 h-8 text-purple-500" />
              <span className="font-bold text-xl">WebGen</span>
            </div>
            <a
              href="https://github.com"
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-3xl w-full space-y-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Generate Websites with AI
          </h1>
          <p className="text-gray-400 text-lg">
            Describe your website and watch it come to life instantly
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dream website..."
                className="w-full h-32 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none text-white placeholder-gray-500"
              />
              <button
                type="submit"
                className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
              >
                <span>Generate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="text-gray-500 text-sm">
            Example: "Create a modern landing page for a coffee shop with a hero section and menu"
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Built with modern web technologies
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;