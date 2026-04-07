import { useState } from 'react';
import { Search, Loader2, Link as LinkIcon, Info, Image as ImageIcon, FileVideo, ExternalLink, Database } from 'lucide-react';

export default function App() {
  const [keyword, setKeyword] = useState('batman');
  const [id, setId] = useState('download-bloodhounds-netflix-web-series');
  const [extractUrl, setExtractUrl] = useState('https://nexdrive.pro/genxfm784776479238/');
  const [latestPage, setLatestPage] = useState('1');
  const [moviesPage, setMoviesPage] = useState('1');
  const [seriesPage, setSeriesPage] = useState('1');
  
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [extractLoading, setExtractLoading] = useState(false);
  const [latestLoading, setLatestLoading] = useState(false);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [seriesLoading, setSeriesLoading] = useState(false);
  
  const [result, setResult] = useState<any>(null);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [extractResult, setExtractResult] = useState<any>(null);
  const [latestResult, setLatestResult] = useState<any>(null);
  const [moviesResult, setMoviesResult] = useState<any>(null);
  const [seriesResult, setSeriesResult] = useState<any>(null);
  
  const [error, setError] = useState('');
  const [searchError, setSearchError] = useState('');
  const [extractError, setExtractError] = useState('');
  const [latestError, setLatestError] = useState('');
  const [moviesError, setMoviesError] = useState('');
  const [seriesError, setSeriesError] = useState('');

  const fetchLatest = async () => {
    setLatestLoading(true);
    setLatestError('');
    setLatestResult(null);
    
    try {
      const response = await fetch(`/api/latest-releases?page=${encodeURIComponent(latestPage)}`);
      const data = await response.json();
      
      if (data.success) {
        setLatestResult(data.data);
      } else {
        setLatestError(data.message || 'Failed to fetch latest releases');
      }
    } catch (err: any) {
      setLatestError(err.message || 'An error occurred');
    } finally {
      setLatestLoading(false);
    }
  };

  const fetchMovies = async () => {
    setMoviesLoading(true);
    setMoviesError('');
    setMoviesResult(null);
    
    try {
      const response = await fetch(`/api/movies?page=${encodeURIComponent(moviesPage)}`);
      const data = await response.json();
      
      if (data.success) {
        setMoviesResult(data.data);
      } else {
        setMoviesError(data.message || 'Failed to fetch movies');
      }
    } catch (err: any) {
      setMoviesError(err.message || 'An error occurred');
    } finally {
      setMoviesLoading(false);
    }
  };

  const fetchSeries = async () => {
    setSeriesLoading(true);
    setSeriesError('');
    setSeriesResult(null);
    
    try {
      const response = await fetch(`/api/series?page=${encodeURIComponent(seriesPage)}`);
      const data = await response.json();
      
      if (data.success) {
        setSeriesResult(data.data);
      } else {
        setSeriesError(data.message || 'Failed to fetch series');
      }
    } catch (err: any) {
      setSeriesError(err.message || 'An error occurred');
    } finally {
      setSeriesLoading(false);
    }
  };

  const searchApi = async () => {
    if (!keyword) return;
    
    setSearchLoading(true);
    setSearchError('');
    setSearchResult(null);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResult(data.data);
      } else {
        setSearchError(data.message || 'Failed to search');
      }
    } catch (err: any) {
      setSearchError(err.message || 'An error occurred');
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchApi = async () => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch(`/api/info?id=${encodeURIComponent(id)}`);
      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Failed to fetch data');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const extractLinks = async () => {
    if (!extractUrl) return;
    
    setExtractLoading(true);
    setExtractError('');
    setExtractResult(null);
    
    try {
      const response = await fetch(`/api/extract?url=${encodeURIComponent(extractUrl)}`);
      const data = await response.json();
      
      if (data.success) {
        setExtractResult(data.data);
      } else {
        setExtractError(data.message || 'Failed to extract links');
      }
    } catch (err: any) {
      setExtractError(err.message || 'An error occurred');
    } finally {
      setExtractLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-indigo-600">VegaMovies Tools</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Search movies, scrape info, or extract protected download links.
          </p>
        </div>

        {/* Latest Releases Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Latest Releases</h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Database className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="1"
                  value={latestPage}
                  onChange={(e) => setLatestPage(e.target.value)}
                  placeholder="Page number (e.g., 1)"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && fetchLatest()}
                />
              </div>
              <button
                onClick={fetchLatest}
                disabled={latestLoading || !latestPage}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {latestLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Fetch Latest'}
              </button>
            </div>
          </div>

          {latestError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3">
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>{latestError}</p>
            </div>
          )}

          {latestResult && (
            <div className="bg-gray-900 p-6 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-100 font-mono text-sm font-medium">JSON Response (Page {latestResult.page})</h3>
              </div>
              <pre className="text-gray-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-96">
                {JSON.stringify(latestResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Movies Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Movies (Dual Audio)</h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Database className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="1"
                  value={moviesPage}
                  onChange={(e) => setMoviesPage(e.target.value)}
                  placeholder="Page number (e.g., 1)"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && fetchMovies()}
                />
              </div>
              <button
                onClick={fetchMovies}
                disabled={moviesLoading || !moviesPage}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {moviesLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Fetch Movies'}
              </button>
            </div>
          </div>

          {moviesError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3">
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>{moviesError}</p>
            </div>
          )}

          {moviesResult && (
            <div className="bg-gray-900 p-6 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-100 font-mono text-sm font-medium">JSON Response (Page {moviesResult.page})</h3>
              </div>
              <pre className="text-gray-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-96">
                {JSON.stringify(moviesResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Series Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Series (Dual Audio)</h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Database className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="1"
                  value={seriesPage}
                  onChange={(e) => setSeriesPage(e.target.value)}
                  placeholder="Page number (e.g., 1)"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && fetchSeries()}
                />
              </div>
              <button
                onClick={fetchSeries}
                disabled={seriesLoading || !seriesPage}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {seriesLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Fetch Series'}
              </button>
            </div>
          </div>

          {seriesError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3">
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>{seriesError}</p>
            </div>
          )}

          {seriesResult && (
            <div className="bg-gray-900 p-6 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-100 font-mono text-sm font-medium">JSON Response (Page {seriesResult.page})</h3>
              </div>
              <pre className="text-gray-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-96">
                {JSON.stringify(seriesResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Movie Search</h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., batman"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && searchApi()}
                />
              </div>
              <button
                onClick={searchApi}
                disabled={searchLoading || !keyword}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {searchLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
              </button>
            </div>
          </div>

          {searchError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3">
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>{searchError}</p>
            </div>
          )}

          {searchResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResult.hits && searchResult.hits.map((hit: any, idx: number) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                    {hit.document.post_thumbnail && (
                      <img src={hit.document.post_thumbnail} alt={hit.document.post_title} className="w-full h-48 object-cover rounded-lg" referrerPolicy="no-referrer" />
                    )}
                    <h3 className="font-semibold text-gray-800 line-clamp-2" dangerouslySetInnerHTML={{__html: hit.document.post_title}}></h3>
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{hit.document.post_date}</span>
                      <button 
                        onClick={() => {
                          setId(hit.document.id);
                          window.scrollTo({ top: document.getElementById('scraper-section')?.offsetTop, behavior: 'smooth' });
                        }}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded"
                      >
                        Scrape This
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-900 p-6 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-100 font-mono text-sm font-medium">JSON Response</h3>
                </div>
                <pre className="text-gray-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-96">
                  {JSON.stringify(searchResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Scraper Section */}
        <div id="scraper-section" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Movie Scraper</h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Database className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="e.g., download-bloodhounds-netflix-web-series"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && fetchApi()}
                />
              </div>
              <button
                onClick={fetchApi}
                disabled={loading || !id}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Scrape'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3">
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-indigo-500" />
                    Poster
                  </h2>
                  {result.poster ? (
                    <img src={result.poster} alt={result.title} className="w-full rounded-lg shadow-sm" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="aspect-[2/3] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      No poster found
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Info className="h-5 w-5 text-indigo-500" />
                    Info
                  </h2>
                  <div className="space-y-3 text-sm">
                    {Object.entries(result.info || {}).map(([key, value]) => (
                      <div key={key} className="flex flex-col border-b border-gray-50 pb-2 last:border-0">
                        <span className="font-medium text-gray-500">{key}</span>
                        <span className="text-gray-900">{value as string}</span>
                      </div>
                    ))}
                    {Object.keys(result.info || {}).length === 0 && (
                      <p className="text-gray-500 italic">No info extracted.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                  <h2 className="text-xl font-semibold">{result.title}</h2>
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium flex items-center gap-2 border-b pb-2">
                      <LinkIcon className="h-5 w-5 text-indigo-500" />
                      Download Links & Episodes
                    </h3>
                    
                    {result.downloadLinks && result.downloadLinks.length > 0 ? (
                      <div className="space-y-6">
                        {result.downloadLinks.map((section: any, idx: number) => (
                          <div key={idx} className="space-y-3">
                            <h4 className="font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-md inline-block">
                              {section.title}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {section.links.map((link: any, linkIdx: number) => (
                                <a
                                  key={linkIdx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                                >
                                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700 truncate mr-2">
                                    {link.name}
                                  </span>
                                  <LinkIcon className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 flex-shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No download links found.</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-100 font-mono text-sm font-medium">JSON Response</h3>
                  </div>
                  <pre className="text-gray-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Extractor Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Link Extractor</h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={extractUrl}
                  onChange={(e) => setExtractUrl(e.target.value)}
                  placeholder="e.g., https://nexdrive.pro/genxfm784776479238/"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && extractLinks()}
                />
              </div>
              <button
                onClick={extractLinks}
                disabled={extractLoading || !extractUrl}
                className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {extractLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Extract'}
              </button>
            </div>
          </div>

          {extractError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3">
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>{extractError}</p>
            </div>
          )}

          {extractResult && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2 text-emerald-800">
                  <FileVideo className="h-5 w-5" />
                  Extracted Files
                </h3>
                <a href={extractResult.finalUrl} target="_blank" rel="noreferrer" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                  View Source <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {extractResult.links.map((link: any, idx: number) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-emerald-100 bg-emerald-50/50 rounded-lg hover:border-emerald-300 hover:bg-emerald-100 transition-colors group"
                  >
                    <span className="text-sm font-medium text-emerald-800 group-hover:text-emerald-900 truncate mr-2">
                      {link.name}
                    </span>
                    <ExternalLink className="h-4 w-4 text-emerald-500 group-hover:text-emerald-600 flex-shrink-0" />
                  </a>
                ))}
              </div>
              
              {extractResult.links.length === 0 && (
                <p className="text-gray-500 italic">No files found at the destination.</p>
              )}

              <div className="bg-gray-900 p-6 rounded-2xl shadow-sm overflow-hidden mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-100 font-mono text-sm font-medium">JSON Response</h3>
                </div>
                <pre className="text-gray-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-96">
                  {JSON.stringify(extractResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
