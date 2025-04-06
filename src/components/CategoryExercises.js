import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const CategoryExercises = () => {
  const navigate = useNavigate();
  const { type, category } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/${type}/${category}`,
          {
            headers: {
              'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
              'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
            }
          }
        );
        
        if (response.data) {
          setExercises(response.data);
        } else {
          setError('No exercises found');
        }
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('Failed to fetch exercises. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (type && category) {
      fetchExercises();
    }
  }, [type, category]);

  return (
    <div className="min-h-screen bg-[#0A0F1C] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 w-full h-full overflow-hidden">
        {/* Animated circles - Made much larger */}
        <div className="absolute -top-[50%] -left-[50%] w-[2000px] h-[2000px] bg-blue-500/10 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
        <div className="absolute top-[25%] -right-[50%] w-[2000px] h-[2000px] bg-purple-500/10 rounded-full blur-3xl mix-blend-screen animate-pulse delay-1000"></div>
        <div className="absolute -bottom-[50%] left-[10%] w-[2000px] h-[2000px] bg-teal-500/10 rounded-full blur-3xl mix-blend-screen animate-pulse delay-2000"></div>
        
        {/* Gradient mesh - Enhanced coverage */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0A0F1C] via-[#1A1F2C] to-[#0A0F1C]"></div>
        
        {/* Grid overlay - Full coverage */}
        <div 
          className="absolute inset-0 w-full h-full opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff08 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff08 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Content Container - Updated padding and layout */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Title Section - Simplified */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              {category.charAt(0).toUpperCase() + category.slice(1)} Exercises
            </span>
          </h1>
        </motion.div>

        {/* Main Content - Added top padding */}
        <div className="pt-8 pb-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full"
              />
              <p className="text-teal-400">Loading exercises...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 bg-red-400/10 rounded-xl p-8 mt-8">
              {error}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {exercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link to={`/exercise/${exercise.id}`}>
                    <div className="relative overflow-hidden rounded-2xl bg-[#1A1F2C] border border-gray-800 hover:border-teal-500/50 transition-all duration-300">
                      {/* Image Container - Changed from aspect-video to aspect-square */}
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={exercise.gifUrl}
                          alt={exercise.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="p-6 relative z-10">
                        <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 
                          text-transparent bg-clip-text group-hover:from-blue-400 group-hover:to-purple-500 
                          transition-all duration-300">
                          {exercise.name}
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                            <span className="text-gray-400">Target: </span>
                            <span className="text-teal-400">{exercise.target}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            <span className="text-gray-400">Equipment: </span>
                            <span className="text-purple-400">{exercise.equipment}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryExercises;
