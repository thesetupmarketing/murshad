/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Camera, Sun, Moon, X, Volume2, VolumeX, Settings, BookHeart, Play, PenLine } from 'lucide-react';

// --- Audio Utilities ---
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playChime = () => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 1);
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 2);
};

const playHeartbeatThump = (time: number) => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(60, time);
  osc.frequency.exponentialRampToValueAtTime(20, time + 0.5);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.08, time + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
  
  osc.start(time);
  osc.stop(time + 0.5);
};

// --- Messages ---
const getMessages = (name: string) => {
  const n = name ? name : "My love";
  return [
    `${n}, you light up my world like nobody else.`,
    "Every moment with you is a beautiful blessing.",
    `Your smile is my absolute favorite thing in the universe, ${n}.`,
    "I love you more than words could ever express.",
    "You are my today and all of my tomorrows.",
    `I am so incredibly lucky to have you in my life, ${n}.`,
    "You make me a better person every single day.",
    "My favorite place in the world is right next to you.",
    "I fall in love with you more and more every day.",
    `${n}, you are the best thing that has ever happened to me.`,
    "Just thinking about you makes me smile.",
    `You are my sunshine on a cloudy day, ${n}.`,
    "I cherish every second I get to spend with you.",
    "You are my dream come true.",
    "My heart beats faster every time I see you."
  ];
};

// --- Components ---

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{id: number, x: number, delay: number, duration: number, size: number}[]>([]);

  useEffect(() => {
    setHearts(Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 15,
      size: 10 + Math.random() * 24
    })));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(h => (
        <motion.div
          key={h.id}
          className="absolute bottom-[-10%]"
          initial={{ x: `${h.x}vw`, y: '10vh', opacity: 0, scale: 0.5 }}
          animate={{
            y: '-110vh',
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
            x: [`${h.x}vw`, `${h.x + (Math.random() * 10 - 5)}vw`]
          }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
            ease: "linear"
          }}
        >
          <Heart className="text-rose-300/40" fill="currentColor" size={h.size} />
        </motion.div>
      ))}
    </div>
  );
};

const MagicMirror = ({ onClose }: { onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ringLight, setRingLight] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError(true);
      }
    };
    initCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-700 ${ringLight ? 'bg-white' : 'bg-black/95 backdrop-blur-2xl'}`}
    >
      {ringLight && (
        <div className="absolute inset-0 bg-white shadow-[inset_0_0_150px_rgba(255,255,255,1)] pointer-events-none z-0" />
      )}

      <div className="relative z-10 w-full max-w-lg px-4 flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`font-serif text-2xl md:text-3xl mb-8 text-center transition-colors duration-500 ${ringLight ? 'text-rose-400' : 'text-rose-200'}`}
        >
          Mirror, mirror on the wall...
        </motion.h2>

        <div className={`relative w-full aspect-[3/4] md:aspect-[4/5] rounded-[2.5rem] overflow-hidden transition-all duration-700 ${ringLight ? 'ring-[16px] ring-white shadow-[0_0_80px_rgba(255,255,255,0.9)]' : 'ring-1 ring-white/10 shadow-2xl'}`}>
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-white p-8 text-center">
              <Heart className="w-12 h-12 text-rose-500 mb-4 opacity-50" />
              <p className="text-lg font-serif text-rose-200">Oops! I couldn't access the camera.</p>
              <p className="text-sm text-zinc-400 mt-2">Please grant camera permissions so I can show you the most beautiful girl in the world.</p>
            </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover scale-x-[-1]"
            />
          )}

          <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-center">
            <p className="text-white font-serif text-xl md:text-2xl drop-shadow-lg font-medium tracking-wide">
              ...you are the fairest of them all. ✨
            </p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center gap-6"
        >
          <button 
            onClick={() => setRingLight(!ringLight)}
            className={`flex items-center gap-3 px-6 py-4 rounded-full backdrop-blur-md transition-all duration-300 ${ringLight ? 'bg-zinc-900 text-yellow-400 hover:bg-zinc-800 shadow-xl' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
          >
            {ringLight ? <Moon size={20} /> : <Sun size={20} />}
            <span className="font-medium">{ringLight ? 'Turn Off Light' : 'Ring Light'}</span>
          </button>
          
          <button 
            onClick={onClose}
            className="p-4 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 hover:scale-105"
          >
            <X size={24} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const LoveLetter = ({ letter, onClose }: { letter: string, onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/40 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="relative w-full max-w-2xl bg-amber-50 rounded-md shadow-2xl overflow-hidden"
      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-rose-400/50" />
      <button onClick={onClose} className="absolute top-4 right-4 text-rose-900/50 hover:text-rose-900 transition-colors">
        <X size={24} />
      </button>
      <div className="p-8 md:p-12 max-h-[80vh] overflow-y-auto">
        <h2 className="text-3xl font-serif text-rose-900 mb-8 text-center border-b border-rose-200 pb-4">My Love Letter</h2>
        <div className="font-serif text-lg text-rose-950 leading-relaxed whitespace-pre-wrap">
          {letter || "I haven't written my letter yet, but just know that I love you!"}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const SettingsModal = ({ 
  name, setName, letter, setLetter, onClose 
}: { 
  name: string, setName: (n: string) => void, letter: string, setLetter: (l: string) => void, onClose: () => void 
}) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-rose-500 flex items-center gap-2">
          <Settings size={24} /> Personalize
        </h2>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><X size={24} /></button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">Her Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2 flex items-center gap-2">
            <PenLine size={16} /> Write a Love Letter
          </label>
          <textarea 
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            placeholder="Write something beautiful from your heart..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all resize-none"
          />
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors"
        >
          Save & Close
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default function App() {
  const [gfName, setGfName] = useState(() => localStorage.getItem('gfName') || '');
  const [loveLetter, setLoveLetter] = useState(() => localStorage.getItem('loveLetter') || '');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showMirror, setShowMirror] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const messages = useMemo(() => getMessages(gfName), [gfName]);

  // Save settings to local storage
  useEffect(() => {
    localStorage.setItem('gfName', gfName);
    localStorage.setItem('loveLetter', loveLetter);
  }, [gfName, loveLetter]);

  // Initial load
  useEffect(() => {
    setMessageIndex(Math.floor(Math.random() * messages.length));
    setIsLoaded(true);
    // Show settings on first visit if no name is set
    if (!localStorage.getItem('gfName')) {
      setShowSettings(true);
    }
  }, [messages.length]);

  // Heartbeat loop
  useEffect(() => {
    let interval: number;
    if (soundEnabled) {
      initAudio();
      interval = window.setInterval(() => {
        if (audioCtx) {
          const now = audioCtx.currentTime;
          playHeartbeatThump(now);
          playHeartbeatThump(now + 0.25);
        }
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [soundEnabled]);

  const pickRandomMessage = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * messages.length);
    } while (newIndex === messageIndex && messages.length > 1);
    setMessageIndex(newIndex);
    
    if (soundEnabled) {
      initAudio();
      playChime();
    }
  };

  const toggleSound = () => {
    if (!soundEnabled) {
      initAudio();
      playChime();
    }
    setSoundEnabled(!soundEnabled);
  };

  const readAloud = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(messages[messageIndex]);
    
    // Try to find a pleasant female voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Female') || 
      v.name.includes('Samantha') || 
      v.name.includes('Google UK English Female')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 0.9; // Slightly slower for romantic effect
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  if (!isLoaded) return null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden font-sans selection:bg-rose-200">
      <FloatingHearts />
      
      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
        <button 
          onClick={toggleSound}
          className="p-3 rounded-full bg-white/50 backdrop-blur-md text-rose-500 hover:bg-white/80 transition-colors shadow-sm"
          title={soundEnabled ? "Mute Sound" : "Enable Sound"}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-3 rounded-full bg-white/50 backdrop-blur-md text-rose-500 hover:bg-white/80 transition-colors shadow-sm"
          title="Personalize"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl w-full bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-16 text-center border border-white/80"
        >
          {/* Animated Heart Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: [1, 1.1, 1], rotate: 0 }}
            transition={{ 
              scale: { repeat: Infinity, duration: soundEnabled ? 1.2 : 3, ease: "easeInOut" },
              rotate: { duration: 1, ease: "easeOut" }
            }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-rose-400 blur-xl opacity-40 rounded-full" />
              <Heart className="relative text-rose-500 w-16 h-16 drop-shadow-md" fill="currentColor" />
            </div>
          </motion.div>

          <h1 className="text-xs md:text-sm font-bold tracking-[0.2em] text-rose-400 uppercase mb-8">
            For {gfName || "My Everything"}
          </h1>

          {/* Message Display */}
          <div className="min-h-[180px] flex flex-col items-center justify-center mb-12 relative group">
            <AnimatePresence mode="wait">
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="px-4"
              >
                <p className="text-3xl md:text-5xl lg:text-6xl font-serif text-slate-800 leading-tight">
                  "{messages[messageIndex]}"
                </p>
              </motion.div>
            </AnimatePresence>
            
            {/* TTS Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={readAloud}
              className="absolute -bottom-8 p-2 rounded-full bg-rose-100 text-rose-500 hover:bg-rose-200 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Read Aloud"
            >
              <Play size={16} fill="currentColor" />
            </motion.button>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-8"
          >
            <button
              onClick={pickRandomMessage}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-4 font-medium text-white transition-all duration-300 bg-rose-500 rounded-full hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Another Reason
            </button>

            <button
              onClick={() => setShowMirror(true)}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-4 font-medium text-rose-600 transition-all duration-300 bg-white rounded-full hover:bg-rose-50 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-200 border border-rose-100"
            >
              <Camera className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform text-rose-400" />
              Magic Mirror
            </button>

            {loveLetter && (
              <button
                onClick={() => setShowLetter(true)}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-4 font-medium text-rose-700 transition-all duration-300 bg-rose-100 rounded-full hover:bg-rose-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-300"
              >
                <BookHeart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform text-rose-500" />
                Read My Letter
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showMirror && <MagicMirror onClose={() => setShowMirror(false)} />}
        {showLetter && <LoveLetter letter={loveLetter} onClose={() => setShowLetter(false)} />}
        {showSettings && (
          <SettingsModal 
            name={gfName} 
            setName={setGfName} 
            letter={loveLetter} 
            setLetter={setLoveLetter} 
            onClose={() => setShowSettings(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
