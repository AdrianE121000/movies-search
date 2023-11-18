import { useState, useEffect, useRef, useCallback } from 'react';
import { Movies } from './components/Movies';
import { useMovies } from './hooks/useMovies';
import debounce from 'just-debounce-it';
import './App.css';

function useSearch() {
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === '';
      return;
    }

    if (search === '') {
      setError('No se puede buscar pelicula');
      return;
    }
    if (search.match(/^\d+$/)) {
      setError('No se puede buscar una película con un número');
      return;
    }
    if (search.length < 3) {
      setError('La busqueda deve tener al menos 3 caracteres');
      return;
    }

    setError(null);
  }, [search]);

  return { search, setSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);
  const { search, setSearch, error } = useSearch();
  const { movies, getMovies, loading } = useMovies({ search, sort });

  const debounceGetMovies = useCallback(
    debounce((search) => {
      getMovies({ search });
    }, 1000),
    [getMovies]
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    getMovies({ search });
  };

  const handleChange = (event) => {
    const newSearch = event.target.value;
    setSearch(newSearch);
    debounceGetMovies(newSearch);
  };

  const handleSort = () => {
    setSort(!sort);
  };

  return (
    <>
      <div className='page'>
        <header>
          <h1>Buscador de peliculas</h1>
          <form
            className='form'
            onSubmit={handleSubmit}>
            <input
              onChange={handleChange}
              value={search}
              name='search'
              placeholder='Avengers, Star Wars, The Matrix...'
            />
            <input
              type='checkbox'
              onChange={handleSort}
              checked={sort}
            />
            <button type='submit'>Buscar</button>
          </form>
          {error && <p>{error}</p>}
        </header>
        <main>
          {loading ? (
            <div className='spinner'></div>
          ) : (
            <Movies movies={movies} />
          )}
        </main>
      </div>
    </>
  );
}

export default App;
