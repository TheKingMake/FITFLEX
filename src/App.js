import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';

// Import components
import ExerciseList from './components/ExerciseList';
import CategoryExercises from './components/CategoryExercises';
import ExerciseDetail from './components/ExerciseDetail';

// Import all images with exact names (no duplicates)
import aboutImage from './assets/about.jpg';
import armImage from './assets/arm.jpg';
import assistedImage from './assets/assisted.jpg';
import backImage from './assets/back.jpg';
import bandImage from './assets/band.jpg';
import barbellImage from './assets/barbell.jpg';
import bodyweightImage from './assets/bodyweight.jpg';
import bosuBallImage from './assets/bosu ball.jpg';
import cardioImage from './assets/cardio.jpg';
import chestImage from './assets/chest.jpg';
import dumbellImage from './assets/dumbell.jpg';
import exercisedImage from './assets/exercised.jpg';
import ezBarbellImage from './assets/Ez barbell.jpg';
import hammerImage from './assets/Hammer.jpg';
import homeImage from './assets/home.jpg';
import kettlebellImage from './assets/kettlebell.jpg';
import leverageMachineImage from './assets/leverage machine.jpg';
import lowerArmImage from './assets/Lower arm.jpg';
import neckImage from './assets/neck.jpg';
import olympicBarbellImage from './assets/Olympic barbel.jpg';
import resistanceBandImage from './assets/Resistance band.jpg';
import ropeImage from './assets/Rope.jpg';
import searchImage from './assets/search.jpg';
import skiergMachineImage from './assets/Skierg machine.jpg';
import stabilityBallImage from './assets/Stability ball.jpg';
import upperArmImage from './assets/Upper arm.jpg';
import upperLegImage from './assets/Upper leg.jpg';
import waistImage from './assets/Waist.jpg';
import stationaryBikeImage from './assets/Stationary bike.jpg';
import smithMachineImage from './assets/Smith machine.jpg';
import sledMachineImage from './assets/Sled machine.jpg';
import tireImage from './assets/tire.jpg';
import trapBarImage from './assets/trap bar.png';
import upperBodyErgometerImage from './assets/upper body ergometer.jpg';
import weightedImage from './assets/weighted.jpg';

// Function to get Lottie animation based on muscle group or equipment
const useLottieAnimation = (name) => {
  const [animationData, setAnimationData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    const fetchAnimation = async () => {
      const animationMappings = {
        'chest': 'https://assets5.lottiefiles.com/packages/lf20_x1gjdldd.json',
        'dumbbells': 'https://assets5.lottiefiles.com/packages/lf20_ck6mwxc8.json',
        'body weight': 'https://assets5.lottiefiles.com/packages/lf20_qm8eqkqm.json',
        'default': 'https://assets5.lottiefiles.com/packages/lf20_tqsxjo2e.json'
      };

      try {
        const searchKey = (name || '').toLowerCase();
        const key = searchKey.split(' ')[0];
        const url = animationMappings[searchKey] || animationMappings[key] || animationMappings.default;
        
        const response = await fetch(url);
        const data = await response.json();
        if (isMounted) {
          setAnimationData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading animation:', error);
        try {
          const response = await fetch(animationMappings.default);
          const data = await response.json();
          if (isMounted) {
            setAnimationData(data);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error loading default animation:', err);
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    fetchAnimation();
    return () => {
      isMounted = false;
    };
  }, [name]);

  return { animationData, loading };
};

// Updated getExerciseImage function with comprehensive category mapping
const getExerciseImage = (name) => {
  console.log('Getting image for:', name); // Debug log

  const nameToImage = {
    // Body Parts
    'back': backImage,
    'cardio': cardioImage,
    'chest': chestImage,
    'Lower arm': lowerArmImage,
    'Upper leg': upperLegImage,
    'neck': neckImage,
    'Upper arm': upperArmImage,
    'Waist': waistImage,

    // Equipment
    'assisted': assistedImage,
    'band': bandImage,
    'barbell': barbellImage,
    'bodyweight': bodyweightImage,
    'bosu ball': bosuBallImage,
    'dumbell': dumbellImage,
    'Ez barbell': ezBarbellImage,
    'Hammer': hammerImage,
    'kettlebell': kettlebellImage,
    'leverage machine': leverageMachineImage,
    'Olympic barbel': olympicBarbellImage,
    'Resistance band': resistanceBandImage,
    'Rope': ropeImage,
    'Skierg machine': skiergMachineImage,
    'Stability ball': stabilityBallImage,
    'Stationary bike': stationaryBikeImage,
    'Smith machine': smithMachineImage,
    'Sled machine': sledMachineImage,
    'tire': tireImage,
    'trap bar': trapBarImage,
    'upper body ergometer': upperBodyErgometerImage,
    'weighted': weightedImage
  };

  const result = nameToImage[name] || searchImage;
  console.log('Returning image:', result); // Debug log
  return result;
};

// Category Card Component for Search Page
const CategoryCard = React.memo(({ item, type, isSelected, onClick }) => {
  if (!item) return null;

  return (
    <div
      onClick={onClick}
      className={`bg-gray-800/50 hover:bg-gray-700/50 rounded-lg overflow-hidden
        cursor-pointer transition-all duration-200 transform hover:scale-105 aspect-[3/5]
        ${isSelected ? 'ring-2 ring-teal-500' : ''}`}
    >
      <div className="relative h-full w-full">
        <img 
          src={getExerciseImage(item.name)}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h3 className="text-white text-lg font-semibold text-center px-4">
            {item.name}
          </h3>
        </div>
      </div>
    </div>
  );
});

// Exercise Animation Component for Exercise List
const ExerciseAnimation = React.memo(({ exercise }) => {
  const { animationData, loading } = useLottieAnimation(exercise?.muscle || exercise?.equipment);
  
  if (!exercise) return null;

  return (
    <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden bg-gray-900/50">
      {!loading && animationData && (
        <Lottie
          animationData={animationData}
          loop={true}
          className="w-full h-full"
        />
      )}
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
        </div>
      )}
    </div>
  );
});

// Exercise Card Component for Exercise List
const ExerciseCard = React.memo(({ exercise, showAnimation = false }) => {
  if (!exercise) return null;

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 
      transition-all duration-200 aspect-[3/5]">
      {showAnimation ? (
        <ExerciseAnimation exercise={exercise} />
      ) : (
        <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
          <img 
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h3 className="text-xl font-bold text-teal-300 mb-2">
        {exercise.name}
      </h3>
      <div className="text-gray-300 space-y-2 text-sm">
        <p><span className="font-semibold">Target:</span> {exercise.target}</p>
        <p><span className="font-semibold">Equipment:</span> {exercise.equipment}</p>
        <p><span className="font-semibold">Body Part:</span> {exercise.bodyPart}</p>
      </div>
    </div>
  );
});

// Exercise Card Component
const ExerciseCardComponent = React.memo(({ exercise }) => {
  const { animationData, loading } = useLottieAnimation(exercise?.muscle || exercise?.equipment);
  
  if (!exercise) return null;

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 
      transition-all duration-200 aspect-[3/5]">
      <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden bg-gray-900/50">
        {!loading && animationData && (
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-full h-full"
          />
        )}
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold text-teal-300 mb-2">
        {exercise.name}
      </h3>
      <div className="text-gray-300 space-y-2 text-sm">
        <p><span className="font-semibold">Type:</span> {exercise.type}</p>
        <p><span className="font-semibold">Equipment:</span> {exercise.equipment}</p>
        <p><span className="font-semibold">Difficulty:</span> {exercise.difficulty}</p>
        <p className="text-xs line-clamp-4">{exercise.instructions}</p>
      </div>
    </div>
  );
});

// Home component with original content and Start Now button
const Home = () => {
  const navigate = useNavigate();

  const handleStartNowClick = () => {
    navigate('/search');
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={homeImage}
          alt="Fitness Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        {/* Top Text Section */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              Get Fit, Stay Strong
            </span>
          </h1>
          <p className="text-gray-300 text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            Discover over 1000+ exercises with step-by-step guidance. Whether you're a beginner or an expert, 
            find the perfect workout for your fitness journey.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartNowClick}
            className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-12 py-5 rounded-full
              font-semibold text-xl transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25"
          >
            Start Now
          </motion.button>
        </motion.div>

        {/* Bottom Grid Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300"
            >
              <h3 className="text-3xl font-semibold mb-4 text-teal-400">
                1000+ Exercises
              </h3>
              <p className="text-gray-300 text-lg">
                Access our comprehensive database of exercises targeting every muscle group. 
                From basic movements to advanced techniques, find the perfect exercise for your routine.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl border border-blue-500/50 transition-all duration-300"
            >
              <h3 className="text-3xl font-semibold mb-4 text-blue-400">
                Video Guides
              </h3>
              <p className="text-gray-300 text-lg">
                Watch detailed video demonstrations for each exercise. 
                Learn proper form and technique to maximize your results and prevent injury.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
            >
              <h3 className="text-3xl font-semibold mb-4 text-purple-400">
                Multiple Categories
              </h3>
              <p className="text-gray-300 text-lg">
                Browse exercises by body part, target muscle, or equipment. 
                Easily find the perfect exercises for your specific training goals.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300"
            >
              <h3 className="text-3xl font-semibold mb-4 text-teal-400">
                Easy to Follow
              </h3>
              <p className="text-gray-300 text-lg">
                Get step-by-step instructions for each exercise. 
                Clear guidance makes it easy to perform exercises correctly and effectively.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Add this ChatBot component before the About component
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: 'Hi! I\'m FitBot 🤖 Your personal fitness and nutrition assistant! Ask me anything about workouts, diet plans, or exercises.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      console.error('Gemini API key is missing. Please check your .env file.');
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Configuration error: API key is missing. Please contact support.',
        timestamp: new Date()
      }]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    console.log( "inside");
    
    const userMessage = { 
      type: 'user', 
      text: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const modelName = 'gemini-1.5-pro'; // Replace with the correct model name
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a fitness expert. Answer this question about fitness and exercise: ${inputMessage}`
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`API request failed: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from API');
      }

      const botResponse = { 
        type: 'bot', 
        text: data.candidates[0].content.parts[0].text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 rounded-full shadow-lg
          hover:shadow-xl transition-shadow duration-300"
      >
        {isOpen ? (
          <motion.svg 
            initial={{ rotate: 0 }}
            animate={{ rotate: 180 }}
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </motion.svg>
        ) : (
          <motion.svg 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
            />
          </motion.svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-96 h-[600px] bg-gray-900 rounded-2xl shadow-2xl 
              flex flex-col overflow-hidden border border-gray-700/50 backdrop-blur-sm"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">FitBot Assistant</h3>
                <p className="text-xs text-white/70">Always here to help!</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                    <div className={`p-4 rounded-2xl shadow-md ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white'
                        : 'bg-gray-800 text-gray-200'
                    }`}>
                      <p className="whitespace-pre-line text-sm">{message.text}</p>
                    </div>
                    <p className={`text-xs mt-1 text-gray-500 ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800 rounded-2xl px-4 py-2">
                    <div className="flex space-x-2">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        className="w-2 h-2 bg-teal-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-gray-800/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about fitness or nutrition..."
                  className="flex-1 bg-gray-900 text-white rounded-xl px-4 py-3 
                    focus:outline-none focus:ring-2 focus:ring-teal-500 
                    placeholder:text-gray-500 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-3 
                    rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Update the About component to include the ChatBot
const About = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/search');
  };

  return (
    <div className="fixed inset-0 w-full" style={{ top: '64px' }}>
      {/* Background Image */}
      <div 
        style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${aboutImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.8)',
          zIndex: -1
        }}
      />
      {/* Content */}
      <div className="absolute inset-0 bg-black/50" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-16">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 bg-black/30 p-8 rounded-xl backdrop-blur-sm"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-teal-300 drop-shadow-lg">
              About FitFlex
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed mb-8 text-gray-200 drop-shadow">
              FitFlex is your ultimate fitness companion, designed to help you achieve your health goals with ease. 
              Explore a vast collection of exercises categorized by body parts and equipment, get expert workout guidance, 
              and track your favorites effortlessly.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-black/30 p-6 rounded-xl backdrop-blur-sm border border-teal-500/20 hover:border-teal-500/50"
            >
              <h3 className="text-2xl font-semibold mb-4 text-teal-400">Our Mission</h3>
              <p className="text-gray-300">
                To make fitness accessible and enjoyable for everyone, providing the tools and knowledge needed for a healthier lifestyle.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="bg-black/30 p-6 rounded-xl backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/50"
            >
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Expert Guidance</h3>
              <p className="text-gray-300">
                Access professional workout demonstrations and detailed instructions for proper form and technique.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="bg-black/30 p-6 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/50"
            >
              <h3 className="text-2xl font-semibold mb-4 text-purple-400">Personalization</h3>
              <p className="text-gray-300">
                Customize your workout experience with filters for equipment, muscle groups, and difficulty levels.
              </p>
            </motion.div>
          </div>

          {/* Statistics Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <div className="text-center bg-black/30 p-6 rounded-xl backdrop-blur-sm">
              <h4 className="text-4xl font-bold text-teal-300 mb-2">1000+</h4>
              <p className="text-gray-300">Exercises</p>
            </div>
            <div className="text-center bg-black/30 p-6 rounded-xl backdrop-blur-sm">
              <h4 className="text-4xl font-bold text-blue-300 mb-2">20+</h4>
              <p className="text-gray-300">Equipment Types</p>
            </div>
            <div className="text-center bg-black/30 p-6 rounded-xl backdrop-blur-sm">
              <h4 className="text-4xl font-bold text-purple-300 mb-2">8+</h4>
              <p className="text-gray-300">Body Parts</p>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center bg-black/30 p-8 rounded-xl backdrop-blur-sm mb-8"
          >
            <h2 className="text-3xl font-bold text-teal-300 mb-6">Start Your Fitness Journey Today</h2>
            <p className="text-lg text-gray-200 mb-8">
              Whether you're a beginner or an athlete, our app ensures a seamless, engaging, and effective fitness journey. 
              Stay fit, stay strong! 💪🔥
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExploreClick}
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-3 rounded-full
                font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25"
            >
              Explore Exercises
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Add ChatBot component */}
      <ChatBot />
    </div>
  );
};

const Search = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('bodyParts');
  const [bodyParts, setBodyParts] = React.useState([]);
  const [equipment, setEquipment] = React.useState([]);
  const [exercises, setExercises] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  // API Ninjas key

  const bodyPartsList = [
    { id: 0, name: 'back' },
    { id: 1, name: 'cardio' },
    { id: 2, name: 'chest' },
    { id: 3, name: 'Lower arm' },
    { id: 4, name: 'Upper leg' },
    { id: 5, name: 'neck' },
    { id: 6, name: 'Upper arm' },
    { id: 7, name: 'Waist' }
  ];

  const equipmentList = [
    { id: 0, name: 'assisted' },
    { id: 1, name: 'band' },
    { id: 2, name: 'barbell' },
    { id: 3, name: 'bodyweight' },
    { id: 4, name: 'bosu ball' },
    { id: 5, name: 'dumbell' },
    { id: 6, name: 'Ez barbell' },
    { id: 7, name: 'Hammer' },
    { id: 8, name: 'kettlebell' },
    { id: 9, name: 'leverage machine' },
    { id: 10, name: 'Olympic barbel' },
    { id: 11, name: 'Resistance band' },
    { id: 12, name: 'Rope' },
    { id: 13, name: 'Skierg machine' },
    { id: 14, name: 'Stability ball' },
    { id: 15, name: 'Stationary bike' },
    { id: 16, name: 'Smith machine' },
    { id: 17, name: 'Sled machine' },
    { id: 18, name: 'tire' },
    { id: 19, name: 'trap bar' },
    { id: 20, name: 'upper body ergometer' },
    { id: 21, name: 'weighted' }
  ];

  React.useEffect(() => {
    if (activeTab === 'bodyParts') {
      fetchBodyParts();
    } else if (activeTab === 'equipment') {
      fetchEquipment();
    }
  }, [activeTab]);

  const fetchBodyParts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://wger.de/api/v2/muscle/');
      const data = await response.json();
      setBodyParts(data.results);
    } catch (err) {
      setError('Failed to fetch body parts. Please try again later.');
      console.error('Error fetching body parts:', err);
    }
    setLoading(false);
  };

  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://wger.de/api/v2/equipment/');
      const data = await response.json();
      setEquipment(data.results);
    } catch (err) {
      setError('Failed to fetch equipment. Please try again later.');
      console.error('Error fetching equipment:', err);
    }
    setLoading(false);
  };

  const handleCategoryClick = (item) => {
    const type = activeTab === 'bodyParts' ? 'bodyPart' : 'equipment';
    navigate(`/category/${type}/${item.name.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-8">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${searchImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.8)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('bodyParts')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'bodyParts'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Body Parts
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'equipment'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Equipment
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {(activeTab === 'bodyParts' ? bodyPartsList : equipmentList).map((item) => (
            <CategoryCard
              key={item.id}
              item={item}
              type={activeTab === 'bodyParts' ? 'bodypart' : 'equipment'}
              isSelected={selectedCategory === item.name}
              onClick={() => handleCategoryClick(item)}
            />
          ))}
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-block text-teal-500">
              <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="text-white mt-2">Loading exercises...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 text-red-400 text-center py-8 bg-red-900/20 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Exercise Results */}
        {exercises.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-teal-300">
                {selectedCategory} Exercises ({exercises.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {exercises.map((exercise, index) => (
                <ExerciseCard key={index} exercise={exercise} showAnimation={false} />
              ))}
            </div>
          </div>
        )}

        {selectedCategory && exercises.length === 0 && !loading && !error && (
          <div className="mt-8 text-white text-center py-8 bg-gray-800/30 rounded-lg">
            <p>No exercises found for {selectedCategory}. Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A0F1C]">
        <Navbar />
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<Search />} />
            <Route path="/category/:type/:category" element={<CategoryExercises />} />
            <Route path="/exercise/:id" element={<ExerciseDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;