const express = require('express');

const router = express.Router();

// Breathing exercise patterns
const breathingPatterns = {
  '4-7-8': {
    name: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8',
    steps: [
      { action: 'inhale', duration: 4, instruction: 'Breathe in slowly through your nose' },
      { action: 'hold', duration: 7, instruction: 'Hold your breath' },
      { action: 'exhale', duration: 8, instruction: 'Exhale slowly through your mouth' }
    ],
    cycles: 4
  },
  'box': {
    name: 'Box Breathing',
    description: 'Equal duration for inhale, hold, exhale, hold',
    steps: [
      { action: 'inhale', duration: 4, instruction: 'Breathe in slowly' },
      { action: 'hold', duration: 4, instruction: 'Hold your breath' },
      { action: 'exhale', duration: 4, instruction: 'Exhale slowly' },
      { action: 'hold', duration: 4, instruction: 'Hold empty lungs' }
    ],
    cycles: 5
  },
  'relaxation': {
    name: 'Progressive Relaxation Breathing',
    description: 'Deep breathing with muscle relaxation',
    steps: [
      { action: 'inhale', duration: 6, instruction: 'Deep breath in, tense muscles' },
      { action: 'hold', duration: 3, instruction: 'Hold and feel the tension' },
      { action: 'exhale', duration: 8, instruction: 'Exhale and release tension' }
    ],
    cycles: 6
  }
};

// Calming exercises
const calmingExercises = [
  {
    id: 'mindfulness',
    name: 'Mindfulness Meditation',
    description: 'Focus on your breath and observe thoughts without judgment',
    duration: 300, // 5 minutes
    instructions: [
      'Find a comfortable seated position',
      'Close your eyes or soften your gaze',
      'Focus on your natural breath',
      'When thoughts arise, acknowledge them and return to breath',
      'Continue for 5 minutes'
    ]
  },
  {
    id: 'body-scan',
    name: 'Body Scan Relaxation',
    description: 'Systematically relax each part of your body',
    duration: 600, // 10 minutes
    instructions: [
      'Lie down in a comfortable position',
      'Start with your toes, tense and release',
      'Move up through your legs, torso, arms, and head',
      'Focus on the feeling of relaxation',
      'Take your time with each body part'
    ]
  },
  {
    id: 'gratitude',
    name: 'Gratitude Practice',
    description: 'Reflect on things you are thankful for',
    duration: 180, // 3 minutes
    instructions: [
      'Think of three things you are grateful for today',
      'Reflect on why each brings you joy',
      'Feel the positive emotions',
      'Express thanks internally or out loud'
    ]
  },
  {
    id: 'visualization',
    name: 'Guided Visualization',
    description: 'Imagine a peaceful, safe place',
    duration: 240, // 4 minutes
    instructions: [
      'Close your eyes and imagine your safe place',
      'Notice the colors, sounds, and feelings',
      'Walk around and explore this space',
      'Feel the peace and safety',
      'When ready, slowly return to the present'
    ]
  }
];

// Get all breathing patterns
router.get('/breathing', (req, res) => {
  try {
    const patterns = Object.keys(breathingPatterns).map(key => ({
      id: key,
      ...breathingPatterns[key]
    }));

    res.json({
      patterns: patterns,
      total: patterns.length
    });

  } catch (error) {
    console.error('Breathing patterns error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get specific breathing pattern
router.get('/breathing/:pattern', (req, res) => {
  try {
    const { pattern } = req.params;
    
    if (!breathingPatterns[pattern]) {
      return res.status(404).json({ 
        error: 'Breathing pattern not found' 
      });
    }

    res.json({
      id: pattern,
      ...breathingPatterns[pattern]
    });

  } catch (error) {
    console.error('Specific breathing pattern error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Start a breathing exercise
router.post('/breathing/:pattern/start', (req, res) => {
  try {
    const { pattern } = req.params;
    const { cycles = null } = req.body;
    
    if (!breathingPatterns[pattern]) {
      return res.status(404).json({ 
        error: 'Breathing pattern not found' 
      });
    }

    const selectedPattern = breathingPatterns[pattern];
    const exerciseCycles = cycles || selectedPattern.cycles;

    res.json({
      message: 'Breathing exercise started',
      pattern: {
        id: pattern,
        ...selectedPattern,
        cycles: exerciseCycles
      },
      sessionId: Date.now().toString(),
      startTime: new Date().toISOString()
    });

  } catch (error) {
    console.error('Start breathing exercise error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get all calming exercises
router.get('/calming', (req, res) => {
  try {
    res.json({
      exercises: calmingExercises,
      total: calmingExercises.length
    });

  } catch (error) {
    console.error('Calming exercises error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get specific calming exercise
router.get('/calming/:id', (req, res) => {
  try {
    const { id } = req.params;
    const exercise = calmingExercises.find(ex => ex.id === id);
    
    if (!exercise) {
      return res.status(404).json({ 
        error: 'Exercise not found' 
      });
    }

    res.json(exercise);

  } catch (error) {
    console.error('Specific calming exercise error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Start a calming exercise
router.post('/calming/:id/start', (req, res) => {
  try {
    const { id } = req.params;
    const exercise = calmingExercises.find(ex => ex.id === id);
    
    if (!exercise) {
      return res.status(404).json({ 
        error: 'Exercise not found' 
      });
    }

    res.json({
      message: 'Calming exercise started',
      exercise: exercise,
      sessionId: Date.now().toString(),
      startTime: new Date().toISOString(),
      estimatedEndTime: new Date(Date.now() + exercise.duration * 1000).toISOString()
    });

  } catch (error) {
    console.error('Start calming exercise error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get exercise recommendations based on mood
router.get('/recommendations', (req, res) => {
  try {
    const { mood } = req.query;
    
    let recommendations = {
      breathing: '4-7-8',
      calming: 'mindfulness',
      reason: 'General relaxation and stress relief'
    };

    if (mood) {
      switch (mood.toLowerCase()) {
        case 'anxious':
        case 'stressed':
          recommendations = {
            breathing: 'box',
            calming: 'body-scan',
            reason: 'Box breathing helps regulate nervous system, body scan releases tension'
          };
          break;
        case 'sad':
        case 'depressed':
          recommendations = {
            breathing: 'relaxation',
            calming: 'gratitude',
            reason: 'Progressive relaxation with gratitude practice to lift mood'
          };
          break;
        case 'angry':
          recommendations = {
            breathing: '4-7-8',
            calming: 'visualization',
            reason: '4-7-8 breathing calms anger, visualization provides escape'
          };
          break;
        case 'tired':
          recommendations = {
            breathing: 'box',
            calming: 'mindfulness',
            reason: 'Box breathing increases alertness, mindfulness improves focus'
          };
          break;
      }
    }

    res.json({
      recommendations: recommendations,
      mood: mood || 'general'
    });

  } catch (error) {
    console.error('Exercise recommendations error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

module.exports = router; 