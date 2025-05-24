
import React, { useState, useEffect, useCallback } from 'react';
import { AnimalData } from './types';
import { PNG_ANIMALS, STORY_PROMPT_TEMPLATE, IMAGE_PROMPT_TEMPLATE } from './constants';
import { generateStory, generateImage } from './services/geminiService';
import AnimalButton from './components/AnimalButton';
import StoryContent from './components/StoryContent';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Header from './components/Header';

const App: React.FC = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalData | null>(null);
  const [storyText, setStoryText] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingStory, setIsLoadingStory] = useState<boolean>(false);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyIsSet, setApiKeyIsSet] = useState<boolean>(false);
  const [refreshStoryToggle, setRefreshStoryToggle] = useState<boolean>(false);

  useEffect(() => {
    // Check for API key on mount.
    // IMPORTANT: In a real-world scenario, process.env.API_KEY is set during the build process or server-side.
    // For this environment, we simulate checking it. If you are running locally and have an .env file, it would be picked up.
    // The prompt specifies to assume it's pre-configured.
    const key = process.env.API_KEY;
    if (key && key.trim() !== '') {
      setApiKeyIsSet(true);
    } else {
      console.warn("API_KEY environment variable is not set. Storybook functionality will be limited.");
      setError("API Key is not configured. Please set the API_KEY environment variable for the application to work.");
      setApiKeyIsSet(false);
    }
  }, []);

  const handleFetchContent = useCallback(async (animal: AnimalData) => {
    if (!apiKeyIsSet) {
      setError("API Key is not configured. Cannot fetch content.");
      return;
    }

    setIsLoadingStory(true);
    setIsLoadingImage(true);
    setError(null);
    setStoryText('');
    setImageUrl(null);

    // For a better UX, show the animal name in the story content area immediately
    setStoryText(`Let's learn about the ${animal.name}!`); 

    try {
      const storyPrompt = STORY_PROMPT_TEMPLATE(animal.name, animal.description);
      const imagePrompt = IMAGE_PROMPT_TEMPLATE(animal.name);

      // Fetch story and image concurrently
      const [storyResult, imageResult] = await Promise.allSettled([
        generateStory(storyPrompt),
        generateImage(imagePrompt)
      ]);

      if (storyResult.status === 'fulfilled') {
        setStoryText(storyResult.value);
      } else {
        console.error('Story generation failed:', storyResult.reason);
        const errorMessage = storyResult.reason instanceof Error ? storyResult.reason.message : String(storyResult.reason);
        setError(prev => (prev ? prev + '\n' : '') + `Could not tell a story: ${errorMessage}`);
        setStoryText(''); // Clear placeholder
      }
      
      if (imageResult.status === 'fulfilled') {
        setImageUrl(imageResult.value);
      } else {
        console.error('Image generation failed:', imageResult.reason);
        const errorMessage = imageResult.reason instanceof Error ? imageResult.reason.message : String(imageResult.reason);
        setError(prev => (prev ? prev + '\n' : '') + `Could not draw a picture: ${errorMessage}`);
      }
    } catch (e) {
      console.error('General fetch content error:', e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`An unexpected error occurred: ${errorMessage}`);
      setStoryText(''); // Clear placeholder
    } finally {
      setIsLoadingStory(false);
      setIsLoadingImage(false);
    }
  }, [apiKeyIsSet]);

  useEffect(() => {
    if (selectedAnimal && apiKeyIsSet) {
      handleFetchContent(selectedAnimal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnimal, apiKeyIsSet, refreshStoryToggle]); // handleFetchContent is memoized

  const handleAnimalSelect = (animal: AnimalData) => {
    setSelectedAnimal(animal);
  };

  const handleNewStory = () => {
    if (selectedAnimal) {
      setRefreshStoryToggle(prev => !prev);
    }
  };
  
  if (!apiKeyIsSet && !error) {
     // This case handles if API key check is pending or somehow bypassed the initial error set
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-background text-brand-textDark p-4">
        <LoadingSpinner />
        <p className="mt-4 text-lg">Checking configuration...</p>
      </div>
    );
  }
  
  // If API key is explicitly not set and error is already populated from initial check.
  if (!apiKeyIsSet && error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <h1 className="text-3xl font-bold mb-4">Configuration Error</h1>
        <p className="text-lg">{error}</p>
        <p className="mt-2 text-sm">Please ensure the <code>API_KEY</code> environment variable is correctly set for the application.</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-200 via-yellow-100 to-blue-200 text-brand-textDark p-4 selection:bg-brand-primary selection:text-white">
      <Header />
      
      <section aria-labelledby="animal-selection-title" className="py-6 px-2">
        <h2 id="animal-selection-title" className="text-2xl font-bold text-center text-green-700 mb-6">Meet the Animals of Papua New Guinea!</h2>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {PNG_ANIMALS.map(animal => (
            <AnimalButton
              key={animal.id}
              animal={animal}
              onClick={() => handleAnimalSelect(animal)}
              isSelected={selectedAnimal?.id === animal.id}
            />
          ))}
        </div>
      </section>

      <main className="flex-grow flex flex-col items-center justify-center p-4 rounded-lg ">
        {isLoadingStory || isLoadingImage ? (
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-lg text-gray-600">
              {selectedAnimal ? `Creating a story about the ${selectedAnimal.name}...` : 'Getting ready...'}
            </p>
          </div>
        ) : error && (!storyText && !imageUrl) ? ( // Only show general error if no content at all
          <ErrorMessage message={error} />
        ) : selectedAnimal ? (
          <div className="w-full max-w-2xl">
            <StoryContent
              animalName={selectedAnimal.name}
              storyText={storyText}
              imageUrl={imageUrl}
              isLoadingImage={isLoadingImage}
              isLoadingStory={isLoadingStory}
              storyError={error && !storyText ? "Could not load story." : null}
              imageError={error && !imageUrl && storyText ? "Could not load image." : null}
            />
            {error && (storyText || imageUrl) && <ErrorMessage message={error} className="mt-4"/>}
            {!isLoadingStory && !isLoadingImage && storyText && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleNewStory}
                  className="px-6 py-3 bg-brand-accent text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out transform hover:scale-105"
                  aria-label={`Tell another story about ${selectedAnimal.name}`}
                >
                  Tell Another Story about the {selectedAnimal.name}!
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 bg-white/80 rounded-xl shadow-lg">
            <img src="https://picsum.photos/seed/papua/300/200" alt="Papua New Guinea landscape" className="w-48 h-32 object-cover rounded-lg mx-auto mb-4 shadow-md"/>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Welcome to the Storybook!</h2>
            <p className="text-gray-600 text-lg">Select an animal above to start an adventure!</p>
          </div>
        )}
      </main>

      <footer className="text-center py-4 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} PNG Animal Storybook. Powered by curious minds and AI.</p>
      </footer>
    </div>
  );
};

export default App;
