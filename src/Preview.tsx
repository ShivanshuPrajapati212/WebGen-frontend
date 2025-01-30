import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Terminal, Download } from 'lucide-react';

function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  const prompt = location.state?.prompt;
  const [loadingStep, setLoadingStep] = useState(0);
  const [dots, setDots] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [error, setError] = useState('');

  const steps = [
    'Analyzing prompt',
    'Generating HTML structure',
    'Creating styles',
    'Optimizing layout',
    'Finalizing website'
  ];

  useEffect(() => {
    // If no prompt is provided, redirect back to home
    if (!prompt) {
      navigate('/');
      return;
    }

    const controller = new AbortController();

    const fetchWebsite = async () => {
      try {
        const response = await fetch('https://webgen-backend.vercel.app/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prompt }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.code) {
          throw new Error('No HTML content received');
        }

        setGeneratedHtml(data.code);
        setIsLoading(false);
      } catch (error) {
        if (error.name === 'AbortError') return;
        setError(`Failed to generate website: ${error.message}`);
        setIsLoading(false);
      }
    };

    // Animations
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 500);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);

    fetchWebsite();

    return () => {
      controller.abort();
      clearInterval(dotsInterval);
      clearInterval(stepInterval);
    };
  }, [prompt, navigate]);

  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-red-500">Error</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isLoading && generatedHtml) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-4">
        <div className="relative mx-auto max-w-[1400px] rounded-2xl bg-[#1A1A1A] overflow-hidden">
          <button
            onClick={handleDownload}
            className="absolute top-4 right-4 z-10 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <iframe
            srcDoc={generatedHtml}
            className="w-full h-[calc(100vh-2rem)] border-none"
            title="Generated Website"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-3">
              <Terminal className="w-8 h-8 text-purple-500" />
              <span className="font-bold text-xl">WebGen</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full space-y-8 text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
            
            <h2 className="text-2xl font-semibold text-white">
              {steps[loadingStep]}{dots}
            </h2>

            <div className="w-full bg-gray-900 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="mt-4 p-4 bg-gray-900 rounded-lg">
              <p className="text-gray-400 font-mono text-sm break-all">
                {prompt || 'No prompt provided'}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Generating your custom website
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Preview;