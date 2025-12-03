import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { searchYouTube, getYouTubeEmbedUrl } from '../utils/youtubeClient';

export default function TestYoutubePage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    async function fetchSongs() {
      const { data, error } = await supabase
        .from('songs')
        .select('*');
      
      if (error) {
        console.error('Erreur Supabase:', error);
      } else {
        setSongs(data);
        console.log('Chansons récupérées:', data);
      }
      setLoading(false);
    }

    fetchSongs();
  }, []);

  async function testYouTubeSearch() {
    const results = await searchYouTube('Adele Rolling in the Deep', 3);
    console.log('Résultats YouTube:', results);
    alert(`Trouvé ${results.length} vidéos ! Regarde la console (F12).`);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-xl">Chargement...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Titre */}
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Test Supabase + YouTube ✅
        </h1>
        
        {/* Test API YouTube */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-2xl text-white mb-4">🔍 Test YouTube API</h2>
          <button
            onClick={testYouTubeSearch}
            className="bg-neurasound-pink text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
          >
            Tester la recherche YouTube
          </button>
          <p className="text-white/70 text-sm mt-2">
            Clique pour tester si l'API YouTube fonctionne (regarde la console F12)
          </p>
        </div>

        {/* Liste des chansons */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl text-white mb-4">
            🎵 Chansons dans la base de données : {songs.length}
          </h2>
          
          {songs.length === 0 ? (
            <p className="text-white/70 text-center py-8">
              Aucune chanson trouvée. Ajoute des chansons dans SQL Editor !
            </p>
          ) : (
            <ul className="space-y-3">
              {songs.map((song) => (
                <li key={song.id} className="text-white bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Miniature */}
                    {song.thumbnail_url && (
                      <img 
                        src={song.thumbnail_url} 
                        alt={song.title}
                        className="w-24 h-16 object-cover rounded shadow-lg"
                      />
                    )}
                    
                    {/* Infos chanson */}
                    <div className="flex-1">
                      <div className="font-bold text-lg">{song.title}</div>
                      <div className="text-white/70">{song.artist}</div>
                      <div className="flex gap-3 mt-1">
                        <span className="text-white/50 text-sm bg-white/10 px-2 py-1 rounded">
                          {song.category}
                        </span>
                        <span className="text-white/50 text-sm bg-white/10 px-2 py-1 rounded">
                          Difficulté: {song.difficulty}/3
                        </span>
                      </div>
                      <div className="text-white/40 text-xs mt-1">
                        YouTube ID: {song.youtube_id}
                      </div>
                    </div>
                    
                    {/* Bouton Écouter */}
                    <button
                      onClick={() => setCurrentVideo(song.youtube_id)}
                      className="bg-neurasound-orange text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform font-bold shadow-lg"
                    >
                      ▶️ Écouter
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-neurasound-pink">{songs.length}</div>
            <div className="text-white/70 text-sm">Chansons totales</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-neurasound-orange">
              {songs.filter(s => s.category === 'pop').length}
            </div>
            <div className="text-white/70 text-sm">Chansons Pop</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-neurasound-yellow">
              {songs.filter(s => s.category === 'rap').length}
            </div>
            <div className="text-white/70 text-sm">Chansons Rap</div>
          </div>
        </div>

        {/* Lecteur YouTube (Modal) */}
        {currentVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-3xl w-full shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">🎵 Lecteur YouTube</h3>
                <button
                  onClick={() => setCurrentVideo(null)}
                  className="text-3xl hover:scale-110 transition-transform text-gray-600 hover:text-red-500"
                >
                  ❌
                </button>
              </div>
              <iframe
                width="100%"
                height="450"
                src={getYouTubeEmbedUrl(currentVideo)}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="rounded-xl shadow-lg"
              />
              <p className="text-gray-600 text-sm mt-3 text-center">
                YouTube ID: <code className="bg-gray-100 px-2 py-1 rounded">{currentVideo}</code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
