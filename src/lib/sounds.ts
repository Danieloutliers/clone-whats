// Audio instances for message sounds
let receivedSoundInstance: HTMLAudioElement | null = null;
let sentSoundInstance: HTMLAudioElement | null = null;

// Initialize audio elements
export const initSounds = () => {
  receivedSoundInstance = new Audio('/media/received.mp3');
  sentSoundInstance = new Audio('/media/sent.mp3');

  // Preload the sounds
  receivedSoundInstance.preload = 'auto';
  sentSoundInstance.preload = 'auto';
};

// Play received message sound
export const playReceivedSound = () => {
  try {
    if (!receivedSoundInstance) {
      receivedSoundInstance = new Audio('/media/received.mp3');
    }
    
    receivedSoundInstance.currentTime = 0;
    receivedSoundInstance.play().catch((error) => {
      console.error('Error playing received sound:', error);
    });
  } catch (error) {
    console.error('Error in playReceivedSound:', error);
  }
};

// Play sent message sound
export const playSentSound = () => {
  try {
    if (!sentSoundInstance) {
      sentSoundInstance = new Audio('/media/sent.mp3');
    }
    
    sentSoundInstance.currentTime = 0;
    sentSoundInstance.play().catch((error) => {
      console.error('Error playing sent sound:', error);
    });
  } catch (error) {
    console.error('Error in playSentSound:', error);
  }
};

// Initialize sounds on component load
// Call this function once when the app starts
try {
  initSounds();
} catch (error) {
  console.error('Failed to initialize sounds:', error);
}
