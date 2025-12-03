import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, Brain, Users, Trophy, User } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const handleStartGame = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      navigate('/game', { state: { playerName: playerName.trim() } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Logo et Titre */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Brain className="w-16 h-16 text-white animate-pulse" />
            <Music className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            NeuraSound
          </h1>
          <p className="text-2xl text-white/90 font-medium">
            La musique dans la tête
          </p>
        </div>

        {/* Slogan */}
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Vos neurones en action, la musique en passion
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          {!showNameInput ? (
            <button
              onClick={() => setShowNameInput(true)}
              className="w-full sm:w-auto bg-white text-neurasound-pink px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Commencer à jouer 🎮
            </button>
          ) : (
            <form onSubmit={handleStartGame} className="w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative w-full sm:w-64">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Ton pseudo"
                    className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-12 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 font-bold"
                    autoFocus
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-white text-neurasound-pink px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
                >
                  Jouer 🎮
                </button>
              </div>
            </form>
          )}
          
          <Link
            to="/leaderboard"
            className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform border-2 border-white/30"
          >
            Voir le classement 🏆
          </Link>
        </div>

        {/* Fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <Users className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">Multijoueur</h3>
            <p className="text-white/80">
              Affrontez vos amis en temps réel
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <Music className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">Thèmes variés</h3>
            <p className="text-white/80">
              Années 2000, rap, pop et plus encore
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <Trophy className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">Classements</h3>
            <p className="text-white/80">
              Montrez vos talents musicaux
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
