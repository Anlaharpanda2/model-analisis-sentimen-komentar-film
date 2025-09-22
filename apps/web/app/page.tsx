'use client';

import { useState } from 'react';

export default function Home() {
  const [model, setModel] = useState('decision-tree');
  const [comment, setComment] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const models = ['decision-tree', 'knn', 'naive_bayes', 'svm'];

  const getModelDisplayName = (modelName: string) => {
    const names: { [key: string]: string } = {
      'decision-tree': 'Decision Tree',
      'knn': 'K-Nearest Neighbors',
      'naive_bayes': 'Naive Bayes',
      'svm': 'Support Vector Machine'
    };
    return names[modelName] || modelName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError('Komentar tidak boleh kosong.');
      return;
    }

    setLoading(true);
    setResult('');
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/predict/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment, model_name: model }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Something went wrong');
      }

      const data = await response.json();
      setResult(data.sentiment);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Main card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 space-y-8 hover:shadow-3xl transition-all duration-300">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7m5 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Analisis Sentimen
            </h1>
            <p className="text-white/70 text-sm">
              Analisis otomatis sentiment dari komentar menggunakan machine learning
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Model Selection */}
            <div className="space-y-2">
              <label htmlFor="model" className="block text-sm font-semibold text-white/90">
                Pilih Model AI
              </label>
              <div className="relative">
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer hover:bg-white/15"
                >
                  {models.map((m) => (
                    <option key={m} value={m} className="bg-gray-800 text-white">
                      {getModelDisplayName(m)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Comment Input */}
            <div className="space-y-2">
              <label htmlFor="comment" className="block text-sm font-semibold text-white/90">
                Komentar untuk Dianalisis
              </label>
              <div className="relative">
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 resize-none hover:bg-white/15"
                  placeholder="Tulis komentar Anda di sini untuk dianalisis sentimentnya..."
                  required
                />
                <div className="absolute bottom-3 right-3 text-xs text-white/50">
                  {comment.length} karakter
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !comment.trim()}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-400/50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Menganalisis...</span>
                  </div>
                </div>
              )}
              <span className={loading ? 'opacity-0' : 'opacity-100'}>
                🚀 Mulai Analisis
              </span>
            </button>
          </form>

          {/* Results */}
          {result && (
            <div className={`p-6 rounded-2xl border-2 transform animate-fadeIn ${
              result === 'positive' 
                ? 'bg-green-500/20 border-green-400/50 backdrop-blur-sm' 
                : 'bg-red-500/20 border-red-400/50 backdrop-blur-sm'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  result === 'positive' ? 'bg-green-400' : 'bg-red-400'
                }`}>
                  {result === 'positive' ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold">
                    Hasil Prediksi: <span className={`font-bold capitalize text-lg ${
                      result === 'positive' ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {result === 'positive' ? 'Positif 😊' : 'Negatif 😔'}
                    </span>
                  </p>
                  <p className="text-white/70 text-sm mt-1">
                    Model: {getModelDisplayName(model)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-6 bg-red-500/20 border-2 border-red-400/50 rounded-2xl backdrop-blur-sm transform animate-fadeIn">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-400 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Terjadi Kesalahan</p>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/50 text-sm">
          <p>Powered by Machine Learning • Made with ❤️</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}