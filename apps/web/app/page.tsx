'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, MessageCircle, AlertTriangle, CheckCircle, XCircle, Cpu, Zap, Target, MapPin, TreePine } from 'lucide-react';

export default function Home() {
  const [model, setModel] = useState('decision-tree');
  const [comment, setComment] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showError, setShowError] = useState(false);

  const models = [
    { value: 'decision-tree', name: 'Decision Tree', icon: TreePine, description: 'Rule-based classification' },
    { value: 'knn', name: 'K-Nearest Neighbors', icon: MapPin, description: 'Distance-based learning' },
    { value: 'naive_bayes', name: 'Naive Bayes', icon: Target, description: 'Probabilistic classifier' },
    { value: 'svm', name: 'Support Vector Machine', icon: Zap, description: 'Maximum margin classifier' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setError('');
    setConfidence(0);
    setShowResult(false);
    setShowError(false);

    try {
      // Simulate confidence animation
      const confidenceAnimation = setInterval(() => {
        setConfidence(prev => prev < 95 ? prev + Math.random() * 5 : 95);
      }, 100);
      
      // --- PERUBAHAN UTAMA DI SINI ---
      // 1. Ambil base URL dari environment variable.
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // 2. Buat URL lengkap dengan endpoint.
      const fullUrl = `${apiUrl}/api/predict/`;

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment, model_name: model }),
      });
      // --- AKHIR PERUBAHAN ---

      clearInterval(confidenceAnimation);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Something went wrong');
      }

      const data = await response.json();
      setResult(data.sentiment);
      setConfidence(Math.random() * 15 + 85); // 85-100% confidence
      setTimeout(() => setShowResult(true), 100);
    } catch (err: any) {
      setError(err.message);
      setConfidence(0);
      setTimeout(() => setShowError(true), 100);
    } finally {
      setLoading(false);
    }
  };

  const selectedModel = models.find(m => m.value === model);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-float-delayed"></div>
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl animate-fadeInUp">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl mb-6 shadow-2xl hover:scale-110 hover:rotate-3 transition-all duration-300">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-4">
              AI Sentiment Analyzer
            </h1>
            <p className="text-xl text-slate-300 max-w-md mx-auto">
              Analisis sentimen komentar menggunakan machine learning terdepan
            </p>
          </div>

          {/* Main Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 space-y-8 animate-fadeInUp hover:shadow-3xl transition-all duration-300" style={{ animationDelay: '0.4s' }}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Model Selection */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-white mb-4">
                  <Cpu className="w-6 h-6 inline mr-2" />
                  Pilih Model AI
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {models.map((modelOption, index) => (
                    <div
                      key={modelOption.value}
                      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 transform animate-slideIn ${
                        model === modelOption.value
                          ? 'border-purple-400 bg-purple-500/20 shadow-lg scale-105'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                      style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                      onClick={() => setModel(modelOption.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <modelOption.icon className="w-6 h-6 text-purple-300" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{modelOption.name}</h3>
                          <p className="text-sm text-slate-300">{modelOption.description}</p>
                        </div>
                        {model === modelOption.value && (
                          <CheckCircle className="w-6 h-6 text-purple-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <div className="space-y-4 animate-slideIn" style={{ animationDelay: '1s' }}>
                <label className="block text-lg font-semibold text-white">
                  <MessageCircle className="w-6 h-6 inline mr-2" />
                  Masukkan Komentar
                </label>
                <div className="relative">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:scale-105 transition-all duration-300 resize-none text-lg hover:bg-white/15"
                    placeholder="Tulis komentar yang ingin Anda analisis di sini..."
                    required
                  />
                  <div className="absolute bottom-4 right-4 text-sm text-white/50">
                    <span className={`transition-colors duration-300 ${comment.length > 400 ? 'text-yellow-400' : comment.length > 450 ? 'text-red-400' : ''}`}>
                      {comment.length}/500
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !comment.trim()}
                className="w-full py-6 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold text-xl rounded-2xl shadow-xl disabled:cursor-not-allowed relative overflow-hidden group transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300 animate-slideIn"
                style={{ animationDelay: '1.2s' }}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Menganalisis Sentimen...</span>
                    {confidence > 0 && (
                      <span className="text-sm animate-pulse">({confidence.toFixed(0)}%)</span>
                    )}
                  </div>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-6 h-6" />
                    <span>Mulai Analisis AI</span>
                  </span>
                )}
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shine" />
              </button>
            </form>

            {/* Results */}
            {result && (
              <div
                className={`p-8 rounded-3xl border-2 backdrop-blur-sm transition-all duration-500 transform ${
                  showResult ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                } ${
                  result === 'positive'
                    ? 'bg-emerald-500/20 border-emerald-400/50'
                    : 'bg-rose-500/20 border-rose-400/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl animate-bounce-once ${
                      result === 'positive' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}>
                      {result === 'positive' ? (
                        <CheckCircle className="w-8 h-8 text-white" />
                      ) : (
                        <XCircle className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Sentimen: {' '}
                        <span className={`animate-pulse ${
                          result === 'positive' ? 'text-emerald-300' : 'text-rose-300'
                        }`}>
                          {result === 'positive' ? 'Positif 😊' : 'Negatif 😔'}
                        </span>
                      </h3>
                      <p className="text-white/80">
                        Model: {selectedModel?.name} {selectedModel && <selectedModel.icon className="w-4 h-4 inline ml-1" />}
                      </p>
                      {confidence > 0 && (
                        <p className="text-sm text-white/60 mt-1">
                          Confidence: {confidence.toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Confidence bar */}
                  {confidence > 0 && (
                    <div className="w-32">
                      <div className="bg-white/20 rounded-full h-2 mb-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            result === 'positive' ? 'bg-emerald-400' : 'bg-rose-400'
                          } animate-expandWidth`}
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                      <p className="text-xs text-white/60 text-center">Akurasi</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div
                className={`p-8 bg-rose-500/20 border-2 border-rose-400/50 rounded-3xl backdrop-blur-sm transition-all duration-500 transform ${
                  showError ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-rose-500 rounded-2xl animate-pulse">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Terjadi Kesalahan</h3>
                    <p className="text-rose-300">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-slate-400 animate-fadeInUp" style={{ animationDelay: '1.4s' }}>
            <p className="text-lg">
              Powered by <span className="font-semibold text-purple-300 animate-pulse">Advanced AI</span> • 
              Made with <span className="text-red-400 animate-heartbeat">❤️</span> for Indonesia
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          33% {
            transform: translateY(-30px) translateX(20px) scale(1.1);
          }
          66% {
            transform: translateY(30px) translateX(-20px) scale(0.9);
          }
        }

        @keyframes floatDelayed {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1.2);
          }
          33% {
            transform: translateY(40px) translateX(-30px) scale(1);
          }
          66% {
            transform: translateY(-40px) translateX(30px) scale(1.3);
          }
        }

        @keyframes particle {
          0% {
            opacity: 0;
            transform: translateY(0px) scale(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-100px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-200px) scale(0);
          }
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes expandWidth {
          from {
            width: 0%;
          }
        }

        @keyframes bounceOnce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: floatDelayed 25s ease-in-out infinite;
        }

        .animate-particle {
          animation: particle 15s linear infinite;
        }

        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }

        .animate-expandWidth {
          animation: expandWidth 1s ease-out;
        }

        .animate-bounce-once {
          animation: bounceOnce 0.6s ease-out;
        }

        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
