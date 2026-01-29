'use client';

import { useState } from 'react';

export default function HomePage() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ id: string; url: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const body: any = { content };
      
      if (ttlSeconds) {
        const ttl = parseInt(ttlSeconds, 10);
        if (isNaN(ttl) || ttl < 1) {
          setError('TTL must be a positive integer');
          setLoading(false);
          return;
        }
        body.ttl_seconds = ttl;
      }
      
      if (maxViews) {
        const views = parseInt(maxViews, 10);
        if (isNaN(views) || views < 1) {
          setError('Max views must be a positive integer');
          setLoading(false);
          return;
        }
        body.max_views = views;
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create paste');
        setLoading(false);
        return;
      }

      setResult(data);
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Pastebin Lite
          </h1>
          <p className="text-gray-400 text-lg">
            Create and share text snippets instantly
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Feature Cards */}
          <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] rounded-2xl p-6 border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Instant sharing
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Create a paste and get a shareable link instantly. No signup required.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] rounded-2xl p-6 border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Time-based expiry
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Set an expiration time and your paste will automatically disappear after the duration.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] rounded-2xl p-6 border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              View limits
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Restrict access with view count limits. Perfect for sharing sensitive information.
            </p>
          </div>
        </div>

        {/* Create Paste Card */}
        <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Create a new paste</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Content Textarea */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 bg-[#121212] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-mono text-sm transition-all"
                  rows={12}
                  placeholder="Paste your content here..."
                  required
                />
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ttl" className="block text-sm font-medium text-gray-300 mb-2">
                    Time to Live (seconds)
                  </label>
                  <input
                    type="number"
                    id="ttl"
                    value={ttlSeconds}
                    onChange={(e) => setTtlSeconds(e.target.value)}
                    className="w-full px-4 py-3 bg-[#121212] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Optional"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-2">Leave empty for no expiration</p>
                </div>

                <div>
                  <label htmlFor="maxViews" className="block text-sm font-medium text-gray-300 mb-2">
                    Max Views
                  </label>
                  <input
                    type="number"
                    id="maxViews"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    className="w-full px-4 py-3 bg-[#121212] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    placeholder="Optional"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-2">Leave empty for unlimited views</p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {result && (
                <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
                  <p className="text-sm font-medium text-green-400 mb-3">Paste created successfully!</p>
                  <p className="text-sm text-gray-400 mb-4">ID: <span className="text-white font-mono">{result.id}</span></p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="text"
                      value={result.url}
                      readOnly
                      className="flex-1 px-4 py-3 bg-[#121212] border border-[#3a3a3a] rounded-xl text-white text-sm font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(result.url);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 text-sm font-semibold transition-all"
                    >
                      Copy
                    </button>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 text-sm font-semibold transition-all text-center"
                    >
                      View
                    </a>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed font-semibold text-lg transition-all shadow-lg shadow-purple-500/20"
              >
                {loading ? 'Creating...' : 'Create Paste'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Secure • Fast • Simple
          </p>
        </div>
      </div>
    </div>
  );
}