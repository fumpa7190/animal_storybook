
import { AnimalData } from './types';

export const PNG_ANIMALS: AnimalData[] = [
  { 
    id: 'tree_kangaroo', 
    name: 'Tree Kangaroo', 
    emoji: '🦘', 
    description: 'a fluffy, gentle kangaroo that lives in trees, known for its long tail for balance and strong claws for climbing high in the rainforest canopy' 
  },
  { 
    id: 'bird_of_paradise', 
    name: 'Bird of Paradise', 
    emoji: '🐦', 
    description: 'a stunningly beautiful bird with vibrant, colorful feathers, famous for its elaborate and mesmerizing mating dances in the jungle clearings'
  },
  { 
    id: 'cassowary', 
    name: 'Cassowary', 
    emoji: '🦃', 
    description: 'a large, flightless bird with a tall, bony casque on its head, powerful legs for running fast, and striking blue and red neck colors, often shy but impressive' 
  },
  { 
    id: 'cuscus', 
    name: 'Cuscus', 
    emoji: '🐨', 
    description: 'a fluffy, slow-moving marsupial similar to a possum, with large, round eyes perfect for seeing at night and a prehensile tail that helps it grip branches in treetops' 
  },
  {
    id: 'sugar_glider',
    name: 'Sugar Glider',
    emoji: '🪁',
    description: 'a small, adorable possum with big eyes and a special membrane that lets it glide through the air between trees, like a tiny superhero'
  }
];

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_IMAGE_MODEL = 'imagen-3.0-generate-002';

export const STORY_SYSTEM_INSTRUCTION = "You are a cheerful and imaginative storyteller for children aged 4 to 8. Your stories are always positive, simple, and feature a friendly animal character. Keep the language very easy to understand, use short sentences, and maintain a lighthearted, wondrous tone. Stories should be about 3-5 sentences long.";
export const STORY_PROMPT_TEMPLATE = (animalName: string, animalDescription: string): string => 
  `Tell a short, whimsical story (about 3-5 simple sentences, ~75-100 words) about a friendly ${animalName} from Papua New Guinea. This ${animalName} is ${animalDescription}. The story should be about a fun little adventure or a happy day it had. Make the story very easy for a young child to follow and end on a happy note.`;

export const IMAGE_PROMPT_TEMPLATE = (animalName: string): string => 
  `A vibrant, cute, and friendly cartoon illustration for a children's storybook. Show a happy ${animalName} from Papua New Guinea in a lush, colorful jungle environment with soft edges. The style should be simple, inviting, and joyful, suitable for young children (ages 4-8). No text in the image.`;
