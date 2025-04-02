import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Character {
  id: string;
  name: string;
  avatar: string;
  source: string;
  description: string;
}

const CharacterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/characters/${id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch character details');
        }
        const data = await response.json();
        setCharacter(data);
      } catch {
        setError('Failed to load character details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setIsWide(img.naturalWidth > img.naturalHeight); // Verificăm dacă imaginea este mai lată decât înaltă
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex items-center justify-center">
      <div
        className={`max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex ${
          isWide ?  'flex-column': 'flex-row'
        }`}
      >
        {/* Imaginea personajului */}
        <div className={`flex-shrink-0 ${isWide ? 'w-1/2' : 'w'}`}>
          <img
            src={character?.avatar}
            alt={character?.name}
            onLoad={handleImageLoad}
            className="max-w-full max-h-[500px] object-contain rounded-lg"
          />
        </div>

        {/* Detaliile personajului */}
        <div className={`p-6 ${isWide ? 'w-1/2' : 'w'}`}>
          <h1 className="text-3xl font-bold mb-4">{character?.name}</h1>
          <p className="text-gray-700 mb-4">{character?.description}</p>
          <p className="text-gray-500">Source: {character?.source}</p>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;