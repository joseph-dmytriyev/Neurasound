import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { getYouTubeEmbedUrl } from '../utils/youtubeClient';
import { Music, Clock, Award } from 'lucide-react';

export default function GamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const playerName = location.state?.playerName || 'Joueur';

  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger les chansons depuis Supabase
  useEffect(() => {
    async function fetchSongs() {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .limit(10); // 10 chansons par partie
      
      if (error) {
        console.error('Erreur lors du chargement des chansons:', error);
        alert('Erreur lors du chargement des chansons');
        navigate('/');
      } else if (data.length === 0) {
        alert('Aucune chanson disponible dans la base de données');
        navigate('/');
      } else {
        // Mélanger les chansons
        const shuffled = data.sort(() => Math.random() - 0.5);
        setSongs(shuffled);
        setLoading(false);
      }
    }

    fetchSongs();
  }, [navigate]);

  // Timer de 15 secondes
  useEffect(() => {
    if (loading || showAnswer || gameFinished) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Temps écoulé, afficher la réponse
      setShowAnswer(true);
    }
  }, [timeLeft, showAnswer, gameFinished, loading]);

  const handleNextSong = () => {
    if (currentSongIndex + 1 < songs.length) {
      setCurrentSongIndex(currentSongIndex + 1);
      setTimeLeft(15);
      setShowAnswer(false);
    } else {
      // Fin du jeu
      setGameFinished(true);
    }
  };

  const handleFoundIt = () => {
    setScore(score + 1);
    setShowAnswer(true);
  };

  const handleGiveUp = () => {
    setShowAnswer(true);
  };

  const handleRestart = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Chargement du blind test...</p>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <Award className="w-24 h-24 text-neurasound-yellow mx-auto animate-bounce" />
          <h1 className="text-5xl font-bold text-white">Bravo {playerName} !</h1>
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <p className="text-6xl font-bold text-neurasound-pink mb-4">{score}/{songs.length}</p>
            <p className="text-2xl text-white">Chansons trouvées</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="bg-white text-neurasound-pink px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Rejouer 🎮
            </button>
            <button
              onClick={() => navigate('/leaderboard')}
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform border-2 border-white/30"
            >
              Voir le classement 🏆
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSong = songs[currentSongIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header avec infos joueur */}
        <div className="flex justify-between items-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/20">
            <p className="text-white font-bold">👤 {playerName}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/20">
            <p className="text-white font-bold">🎵 {currentSongIndex + 1}/{songs.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/20">
            <p className="text-white font-bold">🏆 Score: {score}</p>
          </div>
        </div>

        {/* Timer circulaire */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
              timeLeft <= 5 ? 'bg-red-500/20 animate-pulse' : 'bg-white/10 backdrop-blur-xl'
            } border-4 ${
              timeLeft <= 5 ? 'border-red-500' : 'border-white/30'
            }`}>
              <Clock className={`w-8 h-8 absolute top-4 ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`} />
              <p className={`text-5xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>
                {timeLeft}
              </p>
            </div>
          </div>
          <p className="text-white/70 mt-4 text-lg">
            {showAnswer ? 'Temps écoulé !' : 'Trouvez le titre !'}
          </p>
        </div>

        {/* Lecteur YouTube */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <Music className="w-8 h-8 text-neurasound-pink" />
            <h2 className="text-2xl font-bold text-white">
              {showAnswer ? '🎵 La réponse était...' : '🎧 Écoutez attentivement'}
            </h2>
          </div>
          
          {!showAnswer ? (
            <div className="relative w-full h-[400px] bg-gradient-to-br from-neurasound-pink/30 via-neurasound-orange/30 to-neurasound-yellow/30 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
              <div className="text-center z-10">
                <Music className="w-24 h-24 text-white/50 mx-auto mb-4 animate-pulse" />
                <p className="text-2xl font-bold text-white/70">Écoutez la musique...</p>
              </div>
              <iframe
                width="100%"
                height="400"
                src={`${getYouTubeEmbedUrl(currentSong.youtube_id)}&autoplay=1`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="absolute top-0 left-0 opacity-0 pointer-events-none"
              />
            </div>
          ) : (
            <iframe
              width="100%"
              height="400"
              src={`${getYouTubeEmbedUrl(currentSong.youtube_id)}&autoplay=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-xl shadow-lg"
            />
          )}

          {/* Affichage de la réponse */}
          {showAnswer && (
            <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30 animate-fade-in">
              <div className="text-center space-y-2">
                <p className="text-3xl font-bold text-white">{currentSong.title}</p>
                <p className="text-xl text-white/80">par {currentSong.artist}</p>
                <div className="flex gap-3 justify-center mt-4">
                  <span className="bg-neurasound-pink/30 text-white px-4 py-2 rounded-lg font-bold">
                    {currentSong.category}
                  </span>
                  <span className="bg-neurasound-orange/30 text-white px-4 py-2 rounded-lg font-bold">
                    Difficulté: {currentSong.difficulty}/3
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!showAnswer ? (
            <>
              <button
                onClick={handleFoundIt}
                className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
              >
                ✅ J'ai trouvé !
              </button>
              <button
                onClick={handleGiveUp}
                className="bg-red-500/80 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
              >
                ❌ Je passe
              </button>
            </>
          ) : (
            <button
              onClick={handleNextSong}
              className="bg-white text-neurasound-pink px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              {currentSongIndex + 1 < songs.length ? 'Chanson suivante ➡️' : 'Voir les résultats 🏆'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
