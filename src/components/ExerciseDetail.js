import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ExerciseVideos from './ExerciseVideos';
import exercisedBg from '../assets/exercised.jpg';
import searchImage from '../assets/search.jpg';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <motion.div
      className="w-20 h-20 border-4 border-purple-500 rounded-full border-t-transparent"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-purple-400 font-medium"
    >
      Loading exercise details...
    </motion.p>
  </div>
);

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchExerciseData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if data exists in cache and is less than 24 hours old
        const cachedData = localStorage.getItem(`exercise_${id}`);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000; // 24 hours
          
          if (!isExpired) {
            setExercise(data);
            setLoading(false);
            return;
          }
        }

        const exerciseResponse = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`,
          {
            headers: {
              'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
              'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY
            }
          }
        );
        
        if (!exerciseResponse.data) {
          throw new Error('No exercise data received');
        }
        
        // Store in cache with timestamp
        localStorage.setItem(`exercise_${id}`, JSON.stringify({
          data: exerciseResponse.data,
          timestamp: Date.now()
        }));
        
        setExercise(exerciseResponse.data);

        // Fetch YouTube videos
        const youtubeResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${exerciseResponse.data.name} exercise&key=${process.env.REACT_APP_YOUTUBE_API_KEY}&maxResults=6`
        );
        const youtubeData = await youtubeResponse.json();
        setVideos(youtubeData.items || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage = err.response?.status === 401 || err.response?.status === 403
          ? 'API key error: Please check your RapidAPI subscription'
          : err.response?.status === 429
          ? 'API rate limit exceeded. Please try again later'
          : 'Failed to fetch data. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center pt-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-red-500/10 p-8 rounded-xl border border-red-500/20"
        >
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-red-300">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <div className="min-h-screen w-full bg-[#0A0F1C]">
      {/* Background with overlay */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${searchImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.8)'
        }}
      />

      <div className="min-h-screen bg-black/50 w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 bg-red-400/10 rounded-xl p-8">
              {error}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Exercise Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
                  {exercise.name}
                </h1>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <span className="px-4 py-2 bg-teal-500/20 border border-teal-500/30 rounded-full text-teal-400">
                    {exercise.bodyPart}
                  </span>
                  <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400">
                    {exercise.target}
                  </span>
                  <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400">
                    {exercise.equipment}
                  </span>
                </div>
              </div>

              {/* Exercise Content */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Exercise GIF */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm 
                    border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300"
                >
                  <div className="w-full aspect-square relative">
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      className="absolute inset-0 w-full h-full object-contain p-4"
                    />
                  </div>
                </motion.div>

                {/* Instructions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="h-full"
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 
                    border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300
                    h-full flex flex-col"
                  >
                    <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 
                      text-transparent bg-clip-text">
                      Exercise Instructions
                    </h2>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                      <ol className="list-decimal list-inside space-y-4">
                        {exercise.instructions?.map((instruction, index) => (
                          <li key={index} className="text-gray-300 leading-relaxed text-lg">
                            {instruction}
                          </li>
                        )) || (
                          <li className="text-gray-400">Instructions not available for this exercise.</li>
                        )}
                      </ol>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Related Videos Section */}
              <div className="mt-12">
                <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r 
                  from-teal-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
                  Related Videos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <motion.div
                      key={video.id.videoId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden 
                        border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                    >
                      <div className="aspect-video relative">
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${video.id.videoId}`}
                          title={video.snippet.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2">
                          {video.snippet.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                          {video.snippet.description}
                        </p>
                        <p className="text-purple-400 text-sm">
                          {video.snippet.channelTitle}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
