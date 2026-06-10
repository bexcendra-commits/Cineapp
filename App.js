import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, ScrollView, TextInput, Linking } from 'react-native';
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = '2a8c0216dfb393e18e9edff711dc1c48';
const BASE_URL = 'https://api.themoviedb.org/3';

const listaDeJuegos = [
  { id: '1', nombre: 'Cine-Trivia: Expert', icono: '❓' },
  { id: '2', nombre: 'Cine-Emoji: Obscuro', icono: '🎭' },
  { id: '3', nombre: 'Timeline-Cine: Preciso', icono: '⏳' },
  { id: '4', nombre: 'Cine-Chain: Six Degrees', icono: '🔗' },
  { id: '5', nombre: 'Cine-Quotes: Deep Cut', icono: '💬' },
  { id: '6', nombre: 'Cine-Crew', icono: '👥' },
  { id: '7', nombre: 'Plot Reconstruction', icono: '🌀' },
  { id: '8', nombre: 'Cine-Frame', icono: '📸' },
];

const recomendacionesOpciones = [
  { id: '1', nombre: 'Búsqueda Inteligente', descripcion: 'Describí lo que querés ver y la app te encuentra la película perfecta', icono: '🔍' },
  { id: '2', nombre: 'Basado en lo que viste', descripcion: 'Recomendaciones según las películas que ya abriste o te gustaron', icono: '📜' },
  { id: '3', nombre: 'Por Estado de Ánimo', descripcion: 'Noche de tensión, reflexión profunda, melancolía, etc.', icono: '🌌' },
  { id: '4', nombre: 'Hidden Gems', descripcion: 'Joyas ocultas con alta puntuación pero poca popularidad', icono: '💎' },
  { id: '5', nombre: 'Por Director o Actor', descripcion: 'Explorá el estilo de directores y actores favoritos', icono: '🎬' },
  { id: '6', nombre: 'Por Década', descripcion: 'Los mejores films de los 70s, 90s, 2000s y más', icono: '⏳' },
];

const logrosOpciones = [
  { id: '1', nombre: 'Maestro del Género', descripcion: 'Desbloqueá logros viendo películas de géneros específicos', icono: '🏆', progreso: '8/15', total: 'Géneros' },
  { id: '2', nombre: 'Cinephile por Actor', descripcion: 'Completa filmografías de actores y directores icónicos', icono: '⭐', progreso: '3/12', total: 'Actores' },
  { id: '3', nombre: 'Maratón Extremo', descripcion: 'Por cantidad de películas y minutos vistos', icono: '⏱️', progreso: '5/10', total: 'Cantidad' },
  { id: '4', nombre: 'Viajero en el Tiempo', descripcion: 'Explora las mejores películas por década', icono: '⌛', progreso: '4/8', total: 'Décadas' },
  { id: '5', nombre: 'Cazador de Joyas Ocultas', descripcion: 'Descubre hidden gems con alta calidad', icono: '💎', progreso: '2/7', total: 'Hidden Gems' },
  { id: '6', nombre: 'Logros Legendarios', descripcion: 'Desafíos difíciles y secretos del cine', icono: '🔥', progreso: '1/5', total: 'Especiales' },
];

const perfilStats = {
  username: "agustin1234",
  peliculasVistas: 187,
  minutosVistos: 12450,
  generoFavorito: "Drama",
  actorFavorito: "Leonardo DiCaprio",
  anoFavorito: "2019",
  listasCreadas: 4,
};

const ajustesOpciones = [
  { id: '1', nombre: 'Cuenta', descripcion: 'Editar perfil, cambiar contraseña, email', icono: '👤' },
  { id: '2', nombre: 'Notificaciones', descripcion: 'Gestionar alertas de nuevas películas y recomendaciones', icono: '🔔' },
  { id: '3', nombre: 'Apariencia', descripcion: 'Tema oscuro, tamaño de texto, idioma', icono: '🎨' },
  { id: '4', nombre: 'Privacidad', descripcion: 'Quién puede ver tu perfil y actividad', icono: '🔒' },
  { id: '5', nombre: 'Datos y almacenamiento', descripcion: 'Borrar caché, gestionar descargas', icono: '💾' },
  { id: '6', nombre: 'Sobre la app', descripcion: 'Versión, créditos, términos y condiciones', icono: 'ℹ️' },
  { id: '7', nombre: 'Cerrar sesión', descripcion: '', icono: '🚪' },
];

function MainApp() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeSection, setActiveSection] = useState('Películas');
  const [showNotificationsScreen, setShowNotificationsScreen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPrivacyScreen, setShowPrivacyScreen] = useState(false);
  const [profileHidden, setProfileHidden] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showAppearanceScreen, setShowAppearanceScreen] = useState(false);
  const [showStorageScreen, setShowStorageScreen] = useState(false);
  const [showAboutScreen, setShowAboutScreen] = useState(false);
  const [showFavoritasScreen, setShowFavoritasScreen] = useState(false);
  const [showVerDespuesScreen, setShowVerDespuesScreen] = useState(false);
  const [cacheSize, setCacheSize] = useState(120);
  const [peliculasVistas, setPeliculasVistas] = useState([]);
  const [peliculasFavoritas, setPeliculasFavoritas] = useState([]);
  const [peliculasVerDespues, setPeliculasVerDespues] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [expandedOverview, setExpandedOverview] = useState(false);
  const [movieCollection, setMovieCollection] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [categories, setCategories] = useState([]);
  const [movieCategories, setMovieCategories] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [showAccountScreen, setShowAccountScreen] = useState(false);
  const [accountData, setAccountData] = useState({ username: 'agustin1234', email: '', profileImage: null });

  const theme = {
    background: darkMode ? '#0A0A0A' : '#FFFFFF',
    card: darkMode ? '#1A1A1A' : '#F2F2F2',
    text: darkMode ? '#FFFFFF' : '#000000',
    subText: darkMode ? '#AAAAAA' : '#555555',
    border: darkMode ? '#333' : '#DDD'
  };

  const sections = ['Películas', 'Recomendar', 'Logros', 'Perfil', 'Ajustes'];

  useEffect(() => {
    fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`)
      .then(res => res.json())
      .then(data => setCategories(data.genres || []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const loadAllCategories = async () => {
        const trending = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=es-ES`).then(r => r.json());
        const topRated = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=es-ES`).then(r => r.json());
        const oscars = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&with_awards=true&sort_by=vote_average.desc&vote_count.gte=1000`).then(r => r.json());
        const especiales = [
          { id: 'trending', name: 'Tendencia', movies: trending.results },
{ id: 'top_rated', name: 'Mejor valoradas', movies: topRated.results },
{ id: 'oscars', name: 'Oscar', movies: oscars.results },
        ];
        const normales = await Promise.all(
          categories.map(async (cat) => {
            const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${cat.id}`);
            const data = await res.json();
            return { id: cat.id, name: cat.name, movies: data.results };
          })
        );
        setMovieCategories([...especiales, ...normales]);
      };
      loadAllCategories();
    }
  }, [categories]);

  const fetchMovies = async (pageNum = 1, shouldReset = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc&page=${pageNum}`;
      if (searchQuery) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(searchQuery)}&page=${pageNum}`;
      } else {
        if (yearFilter) url += `&primary_release_year=${yearFilter}`;
        if (ratingFilter) url += `&vote_average.gte=${ratingFilter}`;
        if (langFilter) url += `&with_original_language=${langFilter.toLowerCase()}`;
        if (genreFilter) {
          const g = categories.find(c => c.name.toLowerCase().includes(genreFilter.toLowerCase()));
          if (g) url += `&with_genres=${g.id}`;
        }
      }
      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(prev => shouldReset ? data.results : [...prev, ...data.results]);
      setPage(pageNum);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setLoadingMore(false); }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery || yearFilter || ratingFilter || genreFilter || langFilter) fetchMovies(1, true);
      else setSearchResults([]);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, yearFilter, ratingFilter, genreFilter, langFilter]);

  const clearFilters = () => {
    setYearFilter('');
    setRatingFilter('');
    setGenreFilter('');
    setLangFilter('');
    setSearchQuery('');
    setSearchResults([]);
  };

  const openMovieDetail = (movie) => {
    setSelectedMovie(movie);
    setMovieDetails(null);
    setTrailerKey(null);
    setActiveTab('info');
    
    fetch(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits`)
  .then(res => res.json())
  .then(data => setMovieDetails({...data, certification: null}));
    fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=es-ES`)
      .then(res => res.json())
      .then(data => {
        const trailer = data.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        if (trailer) setTrailerKey(trailer.key);
      });

fetch(`${BASE_URL}/movie/${movie.id}/release_dates?api_key=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    const us = data.results?.find(r => r.iso_3166_1 === 'US');
const ar = data.results?.find(r => r.iso_3166_1 === 'AR');
const region = ar || us;
    const releases = region?.release_dates || [];
const allReleases = data.results?.flatMap(r => r.release_dates?.map(rd => rd.certification)).filter(c => c && c !== '') || [];
const cert = releases.find(r => r.certification && r.certification !== '')?.certification || allReleases[0];
    setMovieDetails(prev => prev ? { ...prev, certification: cert || 'NR' } : prev);
  });

setMovieCollection(null);
fetch(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=es-ES`)
  .then(res => res.json())
  .then(data => {
    if (data.belongs_to_collection) {
      fetch(`${BASE_URL}/collection/${data.belongs_to_collection.id}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json())
        .then(col => setMovieCollection(col));
    }
  });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
    {showAuthModal && (
  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 999, justifyContent: 'center', padding: 30 }}>
    <Text style={{ color: '#C9A84C', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
      {showRegister ? 'Crear cuenta' : 'Iniciar sesión'}
    </Text>
    {authError ? <Text style={{ color: '#ff4444', textAlign: 'center', marginBottom: 10 }}>{authError}</Text> : null}
    <TextInput
      placeholder="Usuario"
      placeholderTextColor="#666"
      style={{ backgroundColor: '#1A1A1A', color: 'white', padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#333' }}
      value={loginEmail}
      onChangeText={setLoginEmail}
      autoCapitalize="none"
    />
    <TextInput
      placeholder="Contraseña"
      placeholderTextColor="#666"
      style={{ backgroundColor: '#1A1A1A', color: 'white', padding: 14, borderRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: '#333' }}
      value={loginPassword}
      onChangeText={setLoginPassword}
      secureTextEntry
    />
    <TouchableOpacity
      style={{ backgroundColor: '#C9A84C', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 }}
      onPress={async () => {
        if (!loginEmail || !loginPassword) { setAuthError('Completá todos los campos'); return; }
        try {
          const stored = await AsyncStorage.getItem('user_' + loginEmail);
          if (showRegister) {
            if (stored) { setAuthError('Ese usuario ya existe'); return; }
            await AsyncStorage.setItem('user_' + loginEmail, loginPassword);
            setUser({ username: loginEmail });
            setShowAuthModal(false);
          } else {
            if (!stored || stored !== loginPassword) { setAuthError('Usuario o contraseña incorrectos'); return; }
            setUser({ username: loginEmail });
            setShowAuthModal(false);
          }
        } catch(e) { setAuthError('Error, intentá de nuevo'); }
      }}
    >
      <Text style={{ color: '#080808', fontWeight: 'bold', fontSize: 16 }}>
        {showRegister ? 'Registrarse' : 'Entrar'}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setShowRegister(!showRegister)}>
      <Text style={{ color: '#C9A84C', textAlign: 'center', marginBottom: 16 }}>
        {showRegister ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate'}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setShowAuthModal(false)}>
      <Text style={{ color: '#666', textAlign: 'center' }}>Cancelar</Text>
    </TouchableOpacity>
  </View>
)}
      <View style={[styles.content, selectedMovie && { marginBottom: 0 }]}>
        {activeSection === 'Películas' ? (
          selectedMovie ? (
  <View style={{ flex: 1 }}>

    {/* BARRA DE PESTAÑAS */}
    <View style={{ flexDirection: 'row', backgroundColor: '#080808', borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.2)' }}>
  <TouchableOpacity onPress={() => { setSelectedMovie(null); setActiveTab('info'); }} style={{ paddingHorizontal: 16, paddingVertical: 12, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: '#C9A84C', fontSize: 16 }}>←</Text>
  </TouchableOpacity>
  {[
    { id: 'info', label: 'Info' },
{ id: 'critica', label: 'critica' },
{ id: 'reparto', label: 'Reparto' },
{ id: 'similar', label: 'Similares' },

  ].map((tab) => (
    <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)} style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === tab.id ? '#C9A84C' : 'transparent' }}>
      <Text style={{ color: activeTab === tab.id ? '#C9A84C' : '#666', fontSize: 13, fontWeight: activeTab === tab.id ? '600' : '400' }}>{tab.label}</Text>
    </TouchableOpacity>
  ))}
    </View>
<ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0 }}>

    {trailerKey ? (
  <TouchableOpacity
    style={{ marginBottom: 20, marginHorizontal: -20, borderRadius: 0, overflow: 'hidden', position: 'relative' }}
    onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${trailerKey}`)}
  >
    <Image
  source={{ uri: `https://img.youtube.com/vi/${trailerKey}/maxresdefault.jpg` }}
  style={{ width: '100%', height: 200, borderRadius: 0 }}
/>
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
      <Text style={{ color: 'white', fontSize: 48, marginLeft: 6 }}>▶</Text>
      <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', marginTop: 10, letterSpacing: 2 }}>TRÁILER</Text>
    </View>
  </TouchableOpacity>
) : (
  <View style={{ marginBottom: 0, marginHorizontal: -20, height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F0F' }}>
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(201,168,76,0.05)' }} />
    <Text style={{ color: 'rgba(201,168,76,0.2)', fontSize: 80, fontWeight: 'bold', position: 'absolute' }}>✦</Text>
    <Text style={{ color: '#C9A84C', fontSize: 28, fontWeight: 'bold', textAlign: 'center', paddingHorizontal: 30, zIndex: 1 }}>{selectedMovie?.title}</Text>
    <Text style={{ color: '#555', fontSize: 13, marginTop: 8 }}>{selectedMovie?.release_date?.substring(0, 4)}</Text>
  </View>
)}
<View style={{ flexDirection: 'row', marginBottom: 20, marginTop: trailerKey ? -50 : -30, zIndex: 10 }}>
  <View style={{ flex: 1, justifyContent: 'space-around', paddingRight: 10, paddingTop: 20 }}>
    <Text style={{ color: '#AAA', fontSize: 13 }}>Dir. {movieDetails?.credits?.crew?.find(c => c.job === 'Director')?.name || '...'}</Text>
    <Text style={{ color: '#AAA', fontSize: 13 }}>{movieDetails?.runtime} min</Text>
    <Text style={{ color: '#AAA', fontSize: 13 }}>{movieDetails?.production_countries?.[0]?.name || '...'}</Text>
  </View>
  <Image source={{ uri: `https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}` }} style={{ width: 120, height: 180, borderRadius: 12, borderWidth: 2, borderColor: '#C9A84C' }} />
  <View style={{ flex: 1, justifyContent: 'space-around', paddingLeft: 10, paddingTop: 20 }}>
    <Text style={{ color: '#AAA', fontSize: 13 }}>{movieDetails?.original_language === 'en' ? 'Inglés' : movieDetails?.original_language === 'es' ? 'Español' : movieDetails?.original_language === 'fr' ? 'Francés' : movieDetails?.original_language === 'de' ? 'Alemán' : movieDetails?.original_language === 'it' ? 'Italiano' : movieDetails?.original_language === 'pt' ? 'Portugués' : movieDetails?.original_language === 'ja' ? 'Japonés' : movieDetails?.original_language === 'ko' ? 'Coreano' : movieDetails?.original_language?.toUpperCase() || '...'}</Text>
    <Text style={{ color: '#AAA', fontSize: 13 }}>{movieDetails?.release_date ? movieDetails.release_date.split('-').reverse().join('/') : '...'}</Text>
    <Text style={{ color: '#AAA', fontSize: 13 }}>{movieDetails?.certification || 'NR'}</Text>
  </View>
</View>
<Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: -15 }}>
  {selectedMovie.title} <Text style={{ color: '#C9A84C', fontSize: 18 }}>★ {movieDetails?.vote_average?.toFixed(1)}</Text>
</Text>
{movieDetails && (
  <>
  <Text style={styles.sectionTitle}>Descripción</Text>
  <Text style={styles.detailOverview} numberOfLines={expandedOverview ? undefined : 5}>{movieDetails.overview}</Text>
  <TouchableOpacity onPress={() => setExpandedOverview(!expandedOverview)}>
    <Text style={{ color: '#C9A84C', fontSize: 13, marginTop: 4 }}>{expandedOverview ? 'Ver menos' : 'Ver más...'}</Text>
  </TouchableOpacity>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 10, gap: 8 }}>
    <TouchableOpacity onPress={() => { if (!user) { setShowAuthModal(true); return; } const yaVista = peliculasVistas.some(p => p.id === selectedMovie.id); if (yaVista) { setPeliculasVistas(peliculasVistas.filter(p => p.id !== selectedMovie.id)); } else { setPeliculasVistas([...peliculasVistas, { id: selectedMovie.id, title: selectedMovie.title, poster_path: selectedMovie.poster_path }]); } }} style={{ flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', backgroundColor: peliculasVistas.some(p => p.id === selectedMovie.id) ? '#1A3A1A' : '#1A1A1A', borderWidth: 1, borderColor: peliculasVistas.some(p => p.id === selectedMovie.id) ? '#C9A84C' : '#333' }}>
      <Text style={{ fontSize: 18 }}>{peliculasVistas.some(p => p.id === selectedMovie.id) ? '✅' : '○'}</Text>
      <Text style={{ color: peliculasVistas.some(p => p.id === selectedMovie.id) ? '#4CAF50' : '#888', fontSize: 11, marginTop: 4 }}>Vista</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => { if (!user) { setShowAuthModal(true); return; } const yaFavorita = peliculasFavoritas.some(p => p.id === selectedMovie.id); if (yaFavorita) { setPeliculasFavoritas(peliculasFavoritas.filter(p => p.id !== selectedMovie.id)); } else { setPeliculasFavoritas([...peliculasFavoritas, { id: selectedMovie.id, title: selectedMovie.title, poster_path: selectedMovie.poster_path }]); } }} style={{ flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', backgroundColor: peliculasFavoritas.some(p => p.id === selectedMovie.id) ? '#1A1500' : '#1A1A1A', borderWidth: 1, borderColor: peliculasFavoritas.some(p => p.id === selectedMovie.id) ? '#C9A84C' : '#333' }}>
      <Text style={{ fontSize: 18 }}>{peliculasFavoritas.some(p => p.id === selectedMovie.id) ? '❤️' : '🤍'}</Text>
      <Text style={{ color: peliculasFavoritas.some(p => p.id === selectedMovie.id) ? '#E50914' : '#888', fontSize: 11, marginTop: 4 }}>Favorita</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => { if (!user) { setShowAuthModal(true); return; } const yaVerDespues = peliculasVerDespues.some(p => p.id === selectedMovie.id); if (yaVerDespues) { setPeliculasVerDespues(peliculasVerDespues.filter(p => p.id !== selectedMovie.id)); } else { setPeliculasVerDespues([...peliculasVerDespues, { id: selectedMovie.id, title: selectedMovie.title, poster_path: selectedMovie.poster_path }]); } }} style={{ flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', backgroundColor: peliculasVerDespues.some(p => p.id === selectedMovie.id) ? '#1A1A3A' : '#1A1A1A', borderWidth: 1, borderColor: peliculasVerDespues.some(p => p.id === selectedMovie.id) ? '#4444FF' : '#333' }}>
      <Text style={{ fontSize: 18 }}>{peliculasVerDespues.some(p => p.id === selectedMovie.id) ? '🔖' : '🕐'}</Text>
      <Text style={{ color: peliculasVerDespues.some(p => p.id === selectedMovie.id) ? '#4444FF' : '#888', fontSize: 11, marginTop: 4 }}>Ver después</Text>
    </TouchableOpacity>
  </View>
  {movieDetails.genres && movieDetails.genres.length > 0 && (
    <>
      <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Géneros</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 }}>
        {movieDetails.genres.map((genre) => (
          <View key={genre.id} style={{ backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 }}>
            <Text style={{ color: '#C9A84C', fontSize: 13 }}>{genre.name}</Text>
          </View>
        ))}
      </View>
    </>
  )}
  {movieCollection && movieCollection.parts && movieCollection.parts.length > 1 && (
    <View style={{ marginBottom: 20 }}>
      <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Saga: {movieCollection.name}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {movieCollection.parts.sort((a, b) => a.release_date?.localeCompare(b.release_date)).map((part) => (
          <TouchableOpacity key={part.id} onPress={() => openMovieDetail(part)} style={{ marginRight: 12, width: 100, opacity: part.id === selectedMovie.id ? 0.5 : 1 }}>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w200${part.poster_path}` }} style={{ width: 100, height: 150, borderRadius: 10, borderWidth: part.id === selectedMovie.id ? 2 : 1, borderColor: part.id === selectedMovie.id ? '#C9A84C' : 'rgba(201,168,76,0.3)' }} />
            <Text style={{ color: '#ccc', fontSize: 11, marginTop: 6, textAlign: 'center' }} numberOfLines={1}>{part.title}</Text>
            <Text style={{ color: '#666', fontSize: 10, textAlign: 'center' }}>{part.release_date?.substring(0, 4)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )}
  </>
)}
</ScrollView>
</View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={styles.searchContainer}>
  <TextInput
    placeholder="Buscá una película…"
    placeholderTextColor="#555"
    style={styles.searchInput}
    value={searchQuery}
    onChangeText={setSearchQuery}
  />
  <View style={[styles.searchUnderline, searchQuery.length > 0 && styles.searchUnderlineActive]} />
              </View>
              
              {loading ? (
                <ActivityIndicator size="large" color="#E50914" style={{ marginTop: 20 }} />
              ) : searchResults.length > 0 ? (
                <FlatList
                  key="list"
                  data={searchResults}
                  keyExtractor={(item, index) => item.id.toString() + index}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => openMovieDetail(item)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' }}>
                      <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }} style={{ width: 55, height: 80, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)' }} />
                      <View style={{ marginLeft: 15, flex: 1 }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }} numberOfLines={1}>{item.title}</Text>
                        <Text style={{ color: '#888', fontSize: 13, marginTop: 4 }}>
                          {item.release_date ? item.release_date.substring(0, 4) : ''}
                          {item.release_date && '  •  '}
                          <Text style={{ color: '#C9A84C', fontSize: 13 }}>{item.director || ''}</Text>
                        </Text>
                      </View>
                      <Text style={{ color: '#E50914', fontSize: 20 }}>›</Text>
                    </TouchableOpacity>
                  )}
                  onEndReached={() => fetchMovies(page + 1, false)}
                />
              ) : (
                <FlatList
  data={movieCategories}
  keyExtractor={(item) => item.id.toString()}
  style={{ flex: 1 }}
  contentContainerStyle={{ paddingBottom: 500 }}
                  renderItem={({ item: cat }) => (
                    <View style={{ marginBottom: 25 }}>
                      <Text style={styles.categoryTitle}>{cat.name}</Text>
                      <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={cat.movies}
                        renderItem={({ item }) => (
                          <TouchableOpacity style={{ marginLeft: 15, width: 110 }} onPress={() => openMovieDetail(item)}>
  <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={{ width: 110, height: 160, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)' }} />
  <Text style={{ color: 'white', fontSize: 11, marginTop: 6 }} numberOfLines={1}>{item.title}</Text>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
    <Text style={{ color: '#666', fontSize: 10 }}>{item.release_date?.substring(0, 4)}</Text>
    <Text style={{ color: '#C9A84C', fontSize: 10 }}>★ {item.vote_average?.toFixed(1)}</Text>
  </View>
</TouchableOpacity>
                        )}
                       />
                    </View>
                  )}
                />
              )}
            </View>
          )
        ) : activeSection === 'Juegos' ? (
          <ScrollView style={styles.containerJuegos} contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.tituloSeccion}>Zona de Juegos</Text>
            {listaDeJuegos.map((juego) => (
              <TouchableOpacity key={juego.id} style={styles.tarjetaJuego} onPress={() => alert('Próximamente: ' + juego.nombre)} activeOpacity={0.7}>
                <Text style={styles.iconoJuego}>{juego.icono}</Text>
                <Text style={styles.textoJuego}>{juego.nombre}</Text>
              </TouchableOpacity>
            ))}
            <Text style={{ color: '#666', textAlign: 'center', marginTop: 30, fontSize: 13 }}>Más juegos se agregarán pronto. Todos diseñados para cinephiles exigentes.</Text>
          </ScrollView>
        ) : activeSection === 'Recomendar' ? (
          <ScrollView style={styles.containerRecomendar} contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.tituloSeccion}>Recomendaciones</Text>
            {recomendacionesOpciones.map((opcion) => (
              <TouchableOpacity key={opcion.id} style={styles.tarjetaRecomendar} onPress={() => alert(`Abriendo: ${opcion.nombre}`)} activeOpacity={0.8}>
                <Text style={styles.iconoRecomendar}>{opcion.icono}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tituloRecomendar}>{opcion.nombre}</Text>
                  <Text style={styles.descripcionRecomendar}>{opcion.descripcion}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : activeSection === 'Logros' ? (
          <ScrollView style={styles.containerLogros} contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.tituloSeccion}>Logros & Trofeos</Text>
            {logrosOpciones.map((logro) => (
              <TouchableOpacity key={logro.id} style={styles.tarjetaLogro} onPress={() => alert(`Logro: ${logro.nombre}\n\n${logro.descripcion}`)} activeOpacity={0.8}>
                <Text style={styles.iconoLogro}>{logro.icono}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tituloLogro}>{logro.nombre}</Text>
                  <Text style={styles.descripcionLogro}>{logro.descripcion}</Text>
                  <Text style={styles.progresoLogro}>{logro.progreso} • {logro.total} logros</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : showFavoritasScreen ? (
          <ScrollView style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
            <View style={{ padding: 20 }}>
              <Text style={styles.tituloSeccion}>❤️ Favoritas</Text>
              {peliculasFavoritas.length === 0 ? (
                <View style={{ alignItems: 'center', marginTop: 60 }}>
                  <Text style={{ fontSize: 50 }}>🤍</Text>
                  <Text style={{ color: '#666', fontSize: 16, marginTop: 16, textAlign: 'center' }}>Todavía no marcaste ninguna favorita</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {peliculasFavoritas.map((pelicula) => (
                    <TouchableOpacity key={pelicula.id} onPress={() => { setShowFavoritasScreen(false); openMovieDetail(pelicula); }} style={{ width: '31%', marginBottom: 16 }}>
                      <Image source={{ uri: `https://image.tmdb.org/t/p/w200${pelicula.poster_path}` }} style={{ width: '100%', height: 150, borderRadius: 10 }} />
                                            <Text style={{ color: '#ccc', fontSize: 11, marginTop: 6, textAlign: 'center' }} numberOfLines={1}>{pelicula.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <TouchableOpacity style={{ alignItems: 'center', marginTop: 20 }} onPress={() => setShowFavoritasScreen(false)}>
                <Text style={{ color: '#888' }}>← Volver</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : showVerDespuesScreen ? (
          <ScrollView style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
            <View style={{ padding: 20 }}>
              <Text style={styles.tituloSeccion}>🔖 Ver después</Text>
              {peliculasVerDespues.length === 0 ? (
                <View style={{ alignItems: 'center', marginTop: 60 }}>
                  <Text style={{ fontSize: 50 }}>🕐</Text>
                  <Text style={{ color: '#666', fontSize: 16, marginTop: 16, textAlign: 'center' }}>Todavía no agregaste películas para ver después</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {peliculasVerDespues.map((pelicula) => (
                    <TouchableOpacity key={pelicula.id} onPress={() => { setShowVerDespuesScreen(false); openMovieDetail(pelicula); }} style={{ width: '31%', marginBottom: 16 }}>
                      <Image source={{ uri: `https://image.tmdb.org/t/p/w200${pelicula.poster_path}` }} style={{ width: '100%', height: 150, borderRadius: 10 }} />
                      <Text style={{ color: '#ccc', fontSize: 11, marginTop: 6, textAlign: 'center' }} numberOfLines={1}>{pelicula.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <TouchableOpacity style={{ alignItems: 'center', marginTop: 20 }} onPress={() => setShowVerDespuesScreen(false)}>
                <Text style={{ color: '#888' }}>← Volver</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : activeSection === 'Perfil' ? (
          <ScrollView style={styles.containerPerfil} contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
              <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#C9A84C', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 3, borderColor: 'rgba(201,168,76,0.3)' }}>
                <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>{perfilStats.username ? perfilStats.username.charAt(0).toUpperCase() : 'A'}</Text>
              </View>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 6 }}>{perfilStats.username || 'agustin1234'}</Text>
              <Text style={{ color: '#AAA', fontSize: 14.5, textAlign: 'center', marginBottom: 25 }}>Drama lover • Fan de Leonardo DiCaprio • {perfilStats.anoFavorito || '2019'} fue mi año</Text>
            </View>

            <View style={{ backgroundColor: '#111', padding: 18, borderRadius: 12, marginBottom: 28 }}>
              <Text style={{ color: '#C9A84C', fontSize: 16, fontWeight: '600', marginBottom: 14 }}>🎬 Mis favoritos</Text>
              <Text style={{ color: 'white', marginBottom: 10 }}>🎭 Género favorito: <Text style={{ color: '#C9A84C' }}>{perfilStats.generoFavorito || 'Drama'}</Text></Text>
              <Text style={{ color: 'white', marginBottom: 10 }}>⭐ Actor favorito: <Text style={{ color: '#C9A84C' }}>{perfilStats.actorFavorito || 'Leonardo DiCaprio'}</Text></Text>
              <Text style={{ color: 'white' }}>📅 Año favorito: <Text style={{ color: '#C9A84C' }}>{perfilStats.anoFavorito || '2019'}</Text></Text>
            </View>

            <View style={{ marginBottom: 32 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Actividad reciente</Text>
                <TouchableOpacity onPress={() => setActiveSection('Películas')}>
                  <Text style={{ color: '#E50914', fontSize: 15 }}>Ver todo →</Text>
                </TouchableOpacity>
              </View>
              {peliculasVistas.length === 0 ? (
                <View style={{ backgroundColor: '#111', padding: 25, borderRadius: 12, alignItems: 'center', justifyContent: 'center', height: 180 }}>
                  <Text style={{ color: '#666', fontSize: 15, textAlign: 'center' }}>📽️ Aquí aparecerán tus últimas películas vistas</Text>
                  <Text style={{ color: '#888', fontSize: 13, marginTop: 12, textAlign: 'center' }}>Cuando empieces a registrar películas, se mostrarán automáticamente.</Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {peliculasVistas.slice(-6).reverse().map((pelicula) => (
                    <TouchableOpacity key={pelicula.id} onPress={() => openMovieDetail(pelicula)} style={{ marginRight: 12 }}>
                      <Image source={{ uri: `https://image.tmdb.org/t/p/w200${pelicula.poster_path}` }} style={{ width: 90, height: 135, borderRadius: 10 }} />
                      <Text style={{ color: '#ccc', fontSize: 11, marginTop: 6, textAlign: 'center', width: 90 }} numberOfLines={1}>{pelicula.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={{ backgroundColor: '#111', padding: 18, borderRadius: 12, marginBottom: 25 }}>
              <Text style={{ color: '#C9A84C', fontSize: 16, fontWeight: '600', marginBottom: 16 }}>Mis estadísticas</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{peliculasVistas.length}</Text>
                  <Text style={{ color: '#888', fontSize: 13 }}>Películas</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{perfilStats.thisYear || 26}</Text>
                  <Text style={{ color: '#888', fontSize: 13 }}>Este año</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{perfilStats.diaryEntries || 110}</Text>
                  <Text style={{ color: '#888', fontSize: 13 }}>Diario</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>4.2</Text>
                  <Text style={{ color: '#888', fontSize: 13 }}>Promedio</Text>
                </View>
              </View>
            </View>

            <View style={{ gap: 12, marginBottom: 30 }}>
              <TouchableOpacity style={styles.profileButton} onPress={() => setActiveSection('Películas')}>
                <Text style={{ color: 'white', fontSize: 16 }}>📚 Mis películas</Text>
                <Text style={{ color: '#666' }}>→</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton} onPress={() => alert('Diario - Próximamente')}>
                <Text style={{ color: 'white', fontSize: 16 }}>📖 Mi diario</Text>
                <Text style={{ color: '#666' }}>→</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#1A1A1A', padding: 18, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 10 }} onPress={() => setShowFavoritasScreen(true)}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, marginRight: 12 }}>❤️</Text>
                  <View>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Favoritas</Text>
                    <Text style={{ color: '#888', fontSize: 13 }}>{peliculasFavoritas.length} películas</Text>
                  </View>
                </View>
                <Text style={{ color: '#E50914', fontSize: 20 }}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#1A1A1A', padding: 18, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 10 }} onPress={() => setShowVerDespuesScreen(true)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, marginRight: 12 }}>🔖</Text>
                  <View>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Ver después</Text>
                    <Text style={{ color: '#888', fontSize: 13 }}>{peliculasVerDespues.length} películas</Text>
                  </View>
                </View>
                <Text style={{ color: '#4444FF', fontSize: 20 }}>›</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ backgroundColor: '#C9A84C', padding: 15, borderRadius: 10, alignItems: 'center' }} onPress={() => alert('Ver todas mis estadísticas')}>

              <Text style={{ color: '#080808', fontWeight: 'bold', fontSize: 16 }}>Ver todas mis estadísticas →</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : showAccountScreen ? (
          <ScrollView style={{ flex: 1, padding: 20 }}>
            <Text style={styles.tituloSeccion}>Cuenta</Text>
            <TouchableOpacity style={{ alignItems: 'center', marginBottom: 30 }} onPress={() => alert('Cambiar foto próximamente')}>
              <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#C9A84C', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 40 }}>{accountData.username.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={{ color: '#888', marginTop: 10 }}>Cambiar foto de perfil</Text>
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput style={styles.inputAjuste} value={accountData.username} onChangeText={(text) => setAccountData({ ...accountData, username: text })} />
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput style={styles.inputAjuste} placeholder="Agregar email" placeholderTextColor="#666" value={accountData.email} onChangeText={(text) => setAccountData({ ...accountData, email: text })} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 25 }}>
              <TouchableOpacity style={[styles.botonGuardar, { flex: 1 }]} onPress={() => alert('Guardado')}>
                <Text style={{ color: 'white' }}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botonCancelar, { flex: 1 }]} onPress={() => setShowAccountScreen(false)}>
                <Text style={{ color: 'white' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : showAppearanceScreen ? (
          <ScrollView style={{ flex: 1, padding: 20 }}>
            <Text style={styles.tituloSeccion}>Apariencia</Text>
            <TouchableOpacity style={styles.tarjetaAjuste} onPress={() => setDarkMode(true)}>
              <Text style={styles.iconoAjuste}>🌙</Text>
              <Text style={styles.tituloAjuste}>Modo oscuro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tarjetaAjuste} onPress={() => setDarkMode(false)}>
              <Text style={styles.iconoAjuste}>☀️</Text>
              <Text style={styles.tituloAjuste}>Modo claro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 30, alignItems: 'center' }} onPress={() => setShowAppearanceScreen(false)}>
              <Text style={{ color: theme.subText }}>← Volver</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : showNotificationsScreen ? (
          <ScrollView style={{ flex: 1, padding: 20 }}>
            <Text style={styles.tituloSeccion}>Notificaciones</Text>
            <TouchableOpacity style={styles.tarjetaAjuste} onPress={() => setNotificationsEnabled(!notificationsEnabled)}>
              <Text style={styles.iconoAjuste}>🔔</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.tituloAjuste, { color: theme.text }]}>Notificaciones</Text>
                <Text style={{ color: theme.subText }}>{notificationsEnabled ? 'Activadas' : 'Desactivadas'}</Text>
              </View>
              <Text style={{ color: notificationsEnabled ? '#4CAF50' : '#999', fontSize: 18 }}>{notificationsEnabled ? 'ON' : 'OFF'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 30, alignItems: 'center' }} onPress={() => setShowNotificationsScreen(false)}>
                          <Text style={{ color: theme.subText }}>← Volver</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : showPrivacyScreen ? (
          <ScrollView style={{ flex: 1, padding: 20 }}>
            <Text style={styles.tituloSeccion}>Privacidad</Text>
            <TouchableOpacity style={styles.tarjetaAjuste} onPress={() => setProfileHidden(!profileHidden)}>
              <Text style={styles.iconoAjuste}>🔒</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.tituloAjuste, { color: theme.text }]}>Ocultar perfil</Text>
                <Text style={{ color: theme.subText }}>{profileHidden ? 'Tu perfil está oculto' : 'Tu perfil es público'}</Text>
              </View>
              <Text style={{ color: profileHidden ? '#E50914' : '#4CAF50', fontSize: 16, fontWeight: 'bold' }}>{profileHidden ? 'Sí' : 'No'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 30, alignItems: 'center' }} onPress={() => setShowPrivacyScreen(false)}>
              <Text style={{ color: theme.subText }}>← Volver</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : showAboutScreen ? (
          <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#0A0A0A' }}>
            <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 30 }}>
              <View style={{ width: 110, height: 110, borderRadius: 28, backgroundColor: '#E50914', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#E50914', shadowOpacity: 0.6, shadowRadius: 20, elevation: 10 }}>
                <Text style={{ fontSize: 55 }}>🎬</Text>
              </View>
              <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold' }}>CineApp</Text>
              <Text style={{ color: '#666', fontSize: 14, marginTop: 4 }}>La app del cinéfilo exigente</Text>
              <View style={{ backgroundColor: '#1A1A1A', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginTop: 10 }}>
                <Text style={{ color: '#E50914', fontSize: 13, fontWeight: '600' }}>Versión 1.0.0</Text>
              </View>
            </View>
            <Text style={{ color: '#666', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10, marginLeft: 4 }}>INFORMACIÓN</Text>
            {[
              { icono: '👨‍💻', label: 'Desarrollador', value: 'Agustín' },
              { icono: '🗄️', label: 'Base de datos', value: 'TMDB API' },
              { icono: '⚛️', label: 'Tecnología', value: 'React Native' },
              { icono: '📅', label: 'Última actualización', value: 'Mayo 2025' },
            ].map((item) => (
              <View key={item.label} style={{ backgroundColor: '#1A1A1A', padding: 16, borderRadius: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A' }}>
                <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icono}</Text>
                <Text style={{ color: '#888', flex: 1, fontSize: 15 }}>{item.label}</Text>
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>{item.value}</Text>
              </View>
            ))}
            <Text style={{ color: '#666', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginTop: 20, marginBottom: 10, marginLeft: 4 }}>LEGAL</Text>
            {[
              { icono: '📄', label: 'Términos y condiciones' },
              { icono: '🔒', label: 'Política de privacidad' },
              { icono: '⭐', label: 'Calificar la app' },
            ].map((item) => (
              <TouchableOpacity key={item.label} style={{ backgroundColor: '#1A1A1A', padding: 18, borderRadius: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A' }} onPress={() => alert(item.label)}>
                <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icono}</Text>
                <Text style={{ color: 'white', fontSize: 16, flex: 1 }}>{item.label}</Text>
                <Text style={{ color: '#444', fontSize: 20 }}>›</Text>
              </TouchableOpacity>
            ))}
            <Text style={{ color: '#333', textAlign: 'center', fontSize: 13, marginTop: 30 }}>Hecho con ❤️ para cinéfilos</Text>
            <Text style={{ color: '#222', textAlign: 'center', fontSize: 12, marginTop: 4, marginBottom: 20 }}>© 2025 CineApp. Todos los derechos reservados.</Text>
            <TouchableOpacity style={{ alignItems: 'center', marginBottom: 40 }} onPress={() => setShowAboutScreen(false)}>
              <Text style={{ color: '#888' }}>← Volver</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : showStorageScreen ? (
          <ScrollView style={{ flex: 1, padding: 20 }}>
            <Text style={styles.tituloSeccion}>Datos y almacenamiento</Text>
            <View style={styles.tarjetaAjuste}>
              <Text style={styles.iconoAjuste}>🧹</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.tituloAjuste, { color: 'white' }]}>Caché</Text>
                <Text style={{ color: '#888' }}>{cacheSize} MB usados</Text>
              </View>
              <TouchableOpacity onPress={() => { setCacheSize(0); alert('Caché borrado'); }}>
                <Text style={{ color: '#E50914', fontWeight: 'bold' }}>Borrar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ marginTop: 30, alignItems: 'center' }} onPress={() => setShowStorageScreen(false)}>
              <Text style={{ color: '#888' }}>← Volver</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <ScrollView style={styles.containerAjustes} contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.tituloSeccion}>Ajustes</Text>
            {ajustesOpciones.map((ajuste) => (
              <TouchableOpacity
                key={ajuste.id}
                style={[styles.tarjetaAjuste, ajuste.nombre === 'Cerrar sesión' && styles.tarjetaCerrarSesion]}
                onPress={() => {
                  if (ajuste.nombre === 'Cerrar sesión') { alert('¿Estás seguro que querés cerrar sesión?'); }
                  else if (ajuste.nombre === 'Cuenta') { setShowAccountScreen(true); }
                  else if (ajuste.nombre === 'Apariencia') { setShowAppearanceScreen(true); }
                  else if (ajuste.nombre === 'Notificaciones') { setShowNotificationsScreen(true); }
                  else if (ajuste.nombre === 'Privacidad') { setShowPrivacyScreen(true); }
                  else if (ajuste.nombre === 'Datos y almacenamiento') { setShowStorageScreen(true); }
                  else if (ajuste.nombre === 'Sobre la app') { setShowAboutScreen(true); }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.iconoAjuste}>{ajuste.icono}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tituloAjuste}>{ajuste.nombre}</Text>
                  {ajuste.descripcion ? <Text style={styles.descripcionAjuste}>{ajuste.descripcion}</Text> : null}
                </View>
                {ajuste.nombre !== 'Cerrar sesión' && <Text style={{ color: '#666', fontSize: 20 }}>›</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
              </View>

      {!selectedMovie && <View style={styles.navbar}>
  {[
  { name: 'Películas', icon: '🎬' },
  { name: 'Recomendar', icon: '✨' },
  { name: 'Logros', icon: '🏆' },
  { name: 'Perfil', icon: '👤' },
  { name: 'Ajustes', icon: '⚙️' },
].map((item) => (
  <TouchableOpacity
    key={item.name}
    style={[styles.navButton, activeSection === item.name && styles.activeButton]}
    onPress={() => setActiveSection(item.name)}
  >
    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
    <Text style={[styles.navText, activeSection === item.name && styles.navTextActive]}>{item.name}</Text>
  </TouchableOpacity>
))}
</View>}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080808' },
  
  content: { flex: 1, marginBottom: 70 },
  inputLabel: { color: '#E50914', fontSize: 14, fontWeight: '600', marginBottom: 6, marginLeft: 4 },
  inputAjuste: { backgroundColor: '#1F1F1F', color: 'white', padding: 14, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: '#333' },
  botonGuardar: { backgroundColor: '#C9A84C', padding: 16, borderRadius: 12, alignItems: 'center' },
  botonCancelar: { backgroundColor: '#222', padding: 16, borderRadius: 12, alignItems: 'center' },
  profileButton: { backgroundColor: '#222', padding: 16, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tituloSeccion: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 25, marginTop: 10, textAlign: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  whiteText: { color: 'white', fontSize: 22 },
  searchContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
searchInput: { backgroundColor: 'transparent', color: 'white', fontSize: 15, fontStyle: 'italic', paddingVertical: 8, paddingHorizontal: 0 },
searchUnderline: { height: 1, backgroundColor: '#333', marginTop: 2 },
searchUnderlineActive: { backgroundColor: '#C9A84C' },
  movieCard: { flex: 0.5, margin: 8 },
  posterImage: { width: '100%', height: 230, borderRadius: 12 },
  movieTitle: { color: 'white', marginTop: 5, fontSize: 11, textAlign: 'center' },
  categoryTitle: { color: '#C9A84C', fontSize: 16, fontWeight: '700', marginLeft: 15, marginBottom: 10, letterSpacing: 1 },
  detailImage: { width: '100%', height: 350, borderRadius: 20, resizeMode: 'contain' },
  detailTitle: { color: 'white', fontSize: 26, fontWeight: 'bold', marginTop: 15 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  detailOverview: { color: '#ccc', fontSize: 15, marginTop: 5, lineHeight: 22 },
  extraInfo: { color: '#ccc', fontSize: 14, marginTop: 8 },
  floatingBackButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: '#E50914',
    padding: 12,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  navbar: { backgroundColor: '#0F0F0F', position: 'absolute', bottom: 0, width: '100%', height: 70, flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
navButton: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, marginHorizontal: 4, borderRadius: 10 },
activeButton: { backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)' },
navText: { color: '#666', fontSize: 11, marginTop: 2 },
navTextActive: { color: '#C9A84C', fontWeight: '600' },
  containerJuegos: { flex: 1, backgroundColor: '#0A0A0A' },
  tarjetaJuego: { backgroundColor: '#1A1A1A', width: '100%', padding: 22, borderRadius: 16, marginBottom: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  iconoJuego: { fontSize: 32, marginRight: 20, width: 40 },
  textoJuego: { color: 'white', fontSize: 19, fontWeight: '600', flex: 1 },
  containerRecomendar: { flex: 1, backgroundColor: '#0A0A0A' },
  tarjetaRecomendar: { backgroundColor: '#1A1A1A', width: '100%', padding: 22, borderRadius: 16, marginBottom: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  iconoRecomendar: { fontSize: 36, marginRight: 20, width: 45 },
  tituloRecomendar: { color: 'white', fontSize: 19, fontWeight: '600', marginBottom: 4 },
  descripcionRecomendar: { color: '#AAAAAA', fontSize: 14, lineHeight: 20 },
  containerLogros: { flex: 1, backgroundColor: '#0A0A0A' },
  tarjetaLogro: { backgroundColor: '#1A1A1A', width: '100%', padding: 22, borderRadius: 16, marginBottom: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  iconoLogro: { fontSize: 38, marginRight: 20, width: 48 },
  tituloLogro: { color: 'white', fontSize: 19, fontWeight: '600', marginBottom: 4 },
  descripcionLogro: { color: '#AAAAAA', fontSize: 14, lineHeight: 20 },
  progresoLogro: { color: '#C9A84C', fontSize: 13, fontWeight: '500', marginTop: 6 },
  containerPerfil: { flex: 1, backgroundColor: '#0A0A0A' },
  perfilHeader: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E50914', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: 'white', fontSize: 40, fontWeight: 'bold' },
  username: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  editButton: { paddingHorizontal: 20, paddingVertical: 8, borderWidth: 1, borderColor: '#E50914', borderRadius: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#1A1A1A', padding: 20, borderRadius: 16, marginBottom: 30 },
  statItem: { alignItems: 'center' },
  statNumber: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 13, marginTop: 4 },
  seccionTitulo: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  recentMovieCard: { marginRight: 12, width: 110 },
  recentPoster: { width: 110, height: 160, borderRadius: 12 },
  recentTitle: { color: '#ccc', fontSize: 12, marginTop: 6, textAlign: 'center' },
  detalleStats: { backgroundColor: '#1A1A1A', padding: 18, borderRadius: 16, marginBottom: 20 },
  detalleText: { color: '#ccc', fontSize: 15, marginBottom: 10 },
  verMasButton: { backgroundColor: '#C9A84C', padding: 14, borderRadius: 12, alignItems: 'center' },
  containerAjustes: { flex: 1, backgroundColor: '#0A0A0A' },
  tarjetaAjuste: { backgroundColor: '#1A1A1A', width: '100%', padding: 22, borderRadius: 16, marginBottom: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  tarjetaCerrarSesion: { backgroundColor: '#1A1500', borderColor: '#C9A84C' },
  iconoAjuste: { fontSize: 32, marginRight: 20, width: 40 },
    tituloAjuste: { color: 'white', fontSize: 19, fontWeight: '600', marginBottom: 4 },
  descripcionAjuste: { color: '#AAAAAA', fontSize: 14, lineHeight: 20 },
});
