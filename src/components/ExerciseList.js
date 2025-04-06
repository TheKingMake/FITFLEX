import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ExerciseList = ({ exercises }) => {
  const navigate = useNavigate();

  return (
    <>
      {exercises.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {exercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(`/exercise/${exercise.id}`)}
              className="bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden 
                border border-gray-700/50 hover:border-teal-500/50 transition-all 
                duration-300 cursor-pointer group"
            >
              <div className="relative aspect-square">
                <img 
                  src={exercise.gifUrl} 
                  alt={exercise.name}
                  className="w-full h-full object-contain p-4 transform 
                    group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-teal-400 to-blue-500 
                  text-transparent bg-clip-text group-hover:from-blue-400 group-hover:to-purple-500 
                  transition-all duration-300">
                  {exercise.name}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    <span className="text-gray-400">Target: </span>
                    <span className="text-teal-400">{exercise.target}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span className="text-gray-400">Body Part: </span>
                    <span className="text-purple-400">{exercise.bodyPart}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default ExerciseList; 