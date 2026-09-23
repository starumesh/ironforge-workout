'use client';

import { useState, useCallback, useEffect, useRef, ReactNode } from 'react';

/* ================================================================
   TYPES
   ================================================================ */

interface Alternative {
  name: string;
  youtube: string;
}

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  muscle: string;
  notes: string;
  formTips: string[];
  youtube: string;
  alternatives: Alternative[];
  restBetweenSets: number;
}

interface WorkoutSection {
  title: string;
  exercises: Exercise[];
}

interface ActivationMove {
  name: string;
  duration: string;
  notes: string;
}

interface WorkoutDay {
  id: string;
  day: string;
  title: string;
  duration: string;
  muscles: string[];
  sections: WorkoutSection[];
  preWorkout: ActivationMove[];
  postWorkout: ActivationMove[];
}

interface FullWorkout {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  overview: string;
  muscles: string[];
  warmup: ActivationMove[];
  sections: WorkoutSection[];
  cooldown: ActivationMove[];
}

type View =
  | 'home'
  | 'split'
  | 'pushpull'
  | 'pre-workout'
  | 'post-workout'
  | 'full-workout-1'
  | 'full-workout-2';

/* ================================================================
   ICONS (inline SVG components)
   ================================================================ */

function IconChevron({ open, className = '' }: { open: boolean; className?: string }) {
  return (
    <svg
      className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-180' : ''} ${className}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function IconPlay({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconDumbbell({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75a.75.75 0 01.75.75v9a.75.75 0 01-.75.75h-.75m0-10.5v10.5m0-10.5H5.25a.75.75 0 00-.75.75v9c0 .414.336.75.75.75h1.5m11.25-10.5h-.75a.75.75 0 00-.75.75v9c0 .414.336.75.75.75h.75m0-10.5v10.5m0-10.5h1.5a.75.75 0 01.75.75v9a.75.75 0 01-.75.75h-1.5m-9-10.5h9v10.5h-9" />
    </svg>
  );
}

function IconArrowLeft({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

function IconClock({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconSwap({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}

function IconFire({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
    </svg>
  );
}

function IconSnow({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l-3 3m3-3l3 3m-3 15l-3-3m3 3l3-3M3 12h18M3 12l3-3m-3 3l3 3m12-6l3 3m-3-3v0m3 3l-3 3" />
    </svg>
  );
}

function IconTarget({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconCheck({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function IconTimer({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 2h4" />
    </svg>
  );
}

function IconX({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/* ================================================================
   HELPER — YouTube search URL builder
   ================================================================ */

function yt(exercise: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise + ' proper form tutorial')}`;
}

/* ================================================================
   WORKOUT DATA — 4‑Day Split (consolidated from 5 images)
   ================================================================ */

const splitRoutine: WorkoutDay[] = [
  {
    id: 'split-1',
    day: 'Day 1 — Monday',
    title: 'Chest + Triceps + Core',
    duration: '~70 min',
    muscles: ['Chest', 'Triceps', 'Core'],
    sections: [
      {
        title: 'Chest',
        exercises: [
          {
            name: 'Flat Barbell Bench Press',
            sets: '4', reps: '8–10', muscle: 'Chest',
            notes: 'Primary compound movement. Control the eccentric, drive through the heels.',
            formTips: ['Retract shoulder blades', 'Grip slightly wider than shoulder width', 'Touch mid-chest, press to lockout', 'Keep feet flat on the floor'],
            youtube: yt('flat barbell bench press'),
            alternatives: [
              { name: 'Dumbbell Bench Press', youtube: yt('dumbbell bench press') },
              { name: 'Machine Chest Press', youtube: yt('machine chest press') },
            ],
            restBetweenSets: 150,
          },
          {
            name: 'Incline Dumbbell Press',
            sets: '3', reps: '10–12', muscle: 'Upper Chest',
            notes: 'Set bench at 30–45° incline. Focus on upper chest engagement.',
            formTips: ['Keep wrists neutral', 'Lower to chest level', 'Press dumbbells up without clanking'],
            youtube: yt('incline dumbbell press'),
            alternatives: [
              { name: 'Incline Barbell Press', youtube: yt('incline barbell press') },
              { name: 'Incline Machine Press', youtube: yt('incline machine press') },
            ],
            restBetweenSets: 90,
          },
          {
            name: 'Cable Fly',
            sets: '3', reps: '12–15', muscle: 'Chest',
            notes: 'Constant tension throughout the movement. Great for mind-muscle connection.',
            formTips: ['Slight bend in elbows', 'Squeeze at peak contraction', 'Control the negative'],
            youtube: yt('cable chest fly'),
            alternatives: [
              { name: 'Dumbbell Fly', youtube: yt('dumbbell chest fly') },
              { name: 'Pec Deck Machine', youtube: yt('pec deck machine') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
      {
        title: 'Triceps',
        exercises: [
          {
            name: 'Rope Pushdown',
            sets: '3', reps: '10–12', muscle: 'Triceps',
            notes: 'Keep elbows pinned to your sides. Split the rope at the bottom for full contraction.',
            formTips: ['Stand upright, slight lean forward', 'Elbows stay fixed', 'Full extension at bottom'],
            youtube: yt('cable rope pushdown triceps'),
            alternatives: [
              { name: 'Straight Bar Pushdown', youtube: yt('straight bar pushdown') },
              { name: 'V-Bar Pushdown', youtube: yt('v-bar pushdown triceps') },
            ],
            restBetweenSets: 60,
          },
          {
            name: 'Overhead Dumbbell Extension',
            sets: '3', reps: '12–15', muscle: 'Triceps (long head)',
            notes: 'Great for targeting the long head of the triceps. Use both hands on one dumbbell.',
            formTips: ['Keep elbows close to head', 'Lower behind head slowly', 'Full stretch at bottom'],
            youtube: yt('overhead dumbbell tricep extension'),
            alternatives: [
              { name: 'Skull Crushers', youtube: yt('skull crushers barbell') },
              { name: 'Overhead Cable Extension', youtube: yt('overhead cable tricep extension') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
      {
        title: 'Core',
        exercises: [
          {
            name: 'Hanging Leg Raises',
            sets: '3', reps: '15', muscle: 'Lower Abs',
            notes: 'Engage core to lift legs. Avoid swinging.',
            formTips: ['Hang with arms fully extended', 'Curl pelvis up at top', 'Slow negative'],
            youtube: yt('hanging leg raises'),
            alternatives: [
              { name: 'Captain\'s Chair Leg Raise', youtube: yt('captains chair leg raise') },
              { name: 'Lying Leg Raises', youtube: yt('lying leg raises') },
            ],
            restBetweenSets: 45,
          },
          {
            name: 'Plank',
            sets: '3', reps: '45 sec hold', muscle: 'Core',
            notes: 'Maintain a straight line from head to heels.',
            formTips: ['Engage glutes and quads', 'Don\'t let hips sag', 'Breathe steadily'],
            youtube: yt('plank exercise proper form'),
            alternatives: [
              { name: 'Dead Bug', youtube: yt('dead bug exercise') },
              { name: 'Ab Wheel Rollout', youtube: yt('ab wheel rollout') },
            ],
            restBetweenSets: 45,
          },
        ],
      },
    ],
    preWorkout: [
      { name: 'Arm Circles (small → large)', duration: '30s', notes: 'Gradually increase range of motion' },
      { name: 'Push-Up to Downward Dog', duration: '30s', notes: 'Flow between positions smoothly' },
      { name: 'Bodyweight Push-Ups (slow tempo)', duration: '30s', notes: '3-second eccentric, activate chest' },
      { name: 'Torso Twists', duration: '30s', notes: 'Rotate through the thoracic spine' },
      { name: 'Cat-Cow Stretches', duration: '30s', notes: 'Alternate between arching and rounding' },
      { name: 'Shoulder Blade Squeezes', duration: '30s', notes: 'Hold each squeeze 3 seconds' },
      { name: 'High Knees', duration: '30s', notes: 'Elevate heart rate, drive knees up' },
      { name: 'Inchworms', duration: '30s', notes: 'Walk hands out to plank, walk feet in' },
      { name: 'Dead Bugs', duration: '30s', notes: 'Opposite arm and leg extension' },
      { name: 'Jumping Jacks', duration: '30s', notes: 'Full range of motion' },
    ],
    postWorkout: [
      { name: 'Doorway Chest Stretch', duration: '30s per side', notes: 'Lean into doorframe, arm at 90°' },
      { name: 'Tricep Overhead Stretch', duration: '30s per arm', notes: 'Pull elbow behind head gently' },
      { name: 'Cross-Body Shoulder Stretch', duration: '30s per arm', notes: 'Pull arm across chest' },
      { name: 'Child\'s Pose', duration: '30s', notes: 'Sink hips back, arms extended' },
      { name: 'Cobra Stretch', duration: '30s', notes: 'Press hips into floor, extend spine' },
      { name: 'Lying Spinal Twist', duration: '30s per side', notes: 'Knees to one side, look opposite' },
      { name: 'Standing Quad Stretch', duration: '30s per leg', notes: 'Pull heel to glute, keep knees together' },
      { name: 'Seated Forward Fold', duration: '30s', notes: 'Reach for toes, relax hamstrings' },
    ],
  },
  {
    id: 'split-2',
    day: 'Day 2 — Tuesday',
    title: 'Back + Biceps + Rear Delts',
    duration: '~75 min',
    muscles: ['Back', 'Biceps', 'Rear Delts'],
    sections: [
      {
        title: 'Back',
        exercises: [
          {
            name: 'Lat Pulldown',
            sets: '4', reps: '8–10', muscle: 'Lats',
            notes: 'Wide grip, pull to upper chest. Lean back slightly.',
            formTips: ['Initiate with lats, not arms', 'Squeeze shoulder blades together', 'Full stretch at top'],
            youtube: yt('lat pulldown'),
            alternatives: [
              { name: 'Pull-Ups', youtube: yt('pull-ups proper form') },
              { name: 'Assisted Pull-Ups', youtube: yt('assisted pull-ups') },
            ],
            restBetweenSets: 90,
          },
          {
            name: 'Seated Cable Row',
            sets: '3', reps: '10–12', muscle: 'Mid Back',
            notes: 'Keep chest up and torso still. Pull to lower sternum.',
            formTips: ['Sit tall with neutral spine', 'Drive elbows back past torso', 'Squeeze at contraction'],
            youtube: yt('seated cable row'),
            alternatives: [
              { name: 'One-Arm Dumbbell Row', youtube: yt('one arm dumbbell row') },
              { name: 'Barbell Row', youtube: yt('barbell row') },
            ],
            restBetweenSets: 90,
          },
          {
            name: 'Pull-Ups (or Assisted)',
            sets: '3', reps: '8–10', muscle: 'Lats / Upper Back',
            notes: 'Full range of motion. Use assistance if needed to hit rep target.',
            formTips: ['Dead hang at bottom', 'Chin over bar at top', 'Controlled negative'],
            youtube: yt('pull-ups form'),
            alternatives: [
              { name: 'Machine Assisted Pull-Up', youtube: yt('machine assisted pull-up') },
              { name: 'Negative Pull-Ups', youtube: yt('negative pull-ups') },
            ],
            restBetweenSets: 90,
          },
          {
            name: 'Face Pulls',
            sets: '3', reps: '15', muscle: 'Rear Delts / Rotator Cuff',
            notes: 'High cable position. Pull to face level with external rotation.',
            formTips: ['Rope at forehead height', 'Pull apart at end', 'Elbows high'],
            youtube: yt('face pulls cable'),
            alternatives: [
              { name: 'Rear Delt Fly (Dumbbell)', youtube: yt('rear delt fly dumbbell') },
              { name: 'Reverse Pec Deck', youtube: yt('reverse pec deck') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
      {
        title: 'Biceps',
        exercises: [
          {
            name: 'Barbell Curl',
            sets: '3', reps: '10–12', muscle: 'Biceps',
            notes: 'Strict form. No swinging or using momentum.',
            formTips: ['Elbows pinned to sides', 'Full range of motion', 'Squeeze at the top'],
            youtube: yt('barbell curl proper form'),
            alternatives: [
              { name: 'EZ-Bar Curl', youtube: yt('ez bar curl') },
              { name: 'Dumbbell Curl', youtube: yt('standing dumbbell curl') },
            ],
            restBetweenSets: 60,
          },
          {
            name: 'Dumbbell Hammer Curl',
            sets: '3', reps: '12–15', muscle: 'Brachialis / Forearms',
            notes: 'Neutral grip. Hits the brachialis and forearms.',
            formTips: ['Thumbs pointing up throughout', 'No wrist rotation', 'Alternate arms or do both'],
            youtube: yt('dumbbell hammer curl'),
            alternatives: [
              { name: 'Cable Rope Hammer Curl', youtube: yt('cable rope hammer curl') },
              { name: 'Cross-Body Hammer Curl', youtube: yt('cross body hammer curl') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
    ],
    preWorkout: [
      { name: 'Arm Circles (small → large)', duration: '30s', notes: 'Warm up shoulder joint' },
      { name: 'Scapular Pull-Ups', duration: '30s', notes: 'Hang and squeeze shoulder blades together' },
      { name: 'Cat-Cow Stretches', duration: '30s', notes: 'Mobilize thoracic spine' },
      { name: 'Doorway Chest Stretch', duration: '30s', notes: 'Open up the chest for pulling' },
      { name: 'Wrist Circles', duration: '30s', notes: 'Both directions, warm up wrists for curls' },
      { name: 'Shoulder Dislocates (towel)', duration: '30s', notes: 'Use a towel or stick, go slow' },
      { name: 'Torso Twists', duration: '30s', notes: 'Rotate through thoracic spine' },
      { name: 'Superman Holds', duration: '30s', notes: 'Lie prone, lift arms and legs, hold 5s' },
      { name: 'High Knees', duration: '30s', notes: 'Get blood flowing' },
      { name: 'Bodyweight Reverse Fly', duration: '30s', notes: 'Hinge forward, raise arms out' },
    ],
    postWorkout: [
      { name: 'Child\'s Pose', duration: '30s', notes: 'Sink hips back, arms extended forward' },
      { name: 'Cat Stretch', duration: '30s', notes: 'Round spine, hold, release' },
      { name: 'Doorway Bicep Stretch', duration: '30s per arm', notes: 'Arm behind on doorframe, turn away' },
      { name: 'Cross-Body Shoulder Stretch', duration: '30s per arm', notes: 'Pull arm across chest' },
      { name: 'Seated Forward Fold', duration: '30s', notes: 'Reach for toes, stretch lower back' },
      { name: 'Lying Spinal Twist', duration: '30s per side', notes: 'Knees to one side, shoulders flat' },
      { name: 'Lat Stretch (doorframe)', duration: '30s per side', notes: 'Grab doorframe overhead, lean away' },
      { name: 'Neck Rolls', duration: '30s', notes: 'Gentle circles both directions' },
    ],
  },
  {
    id: 'split-3',
    day: 'Day 3 — Thursday',
    title: 'Legs + Core',
    duration: '~75 min',
    muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Core'],
    sections: [
      {
        title: 'Legs',
        exercises: [
          {
            name: 'Barbell Squats',
            sets: '4', reps: '8–10', muscle: 'Quads / Glutes',
            notes: 'King of leg exercises. Can substitute bodyweight if needed.',
            formTips: ['Feet shoulder-width apart', 'Knees track over toes', 'Break parallel if mobility allows', 'Keep chest up, core braced'],
            youtube: yt('barbell squat form'),
            alternatives: [
              { name: 'Goblet Squat', youtube: yt('goblet squat') },
              { name: 'Smith Machine Squat', youtube: yt('smith machine squat') },
            ],
            restBetweenSets: 150,
          },
          {
            name: 'Leg Press',
            sets: '3', reps: '12', muscle: 'Quads / Glutes',
            notes: 'Keep lower back pressed into pad. Don\'t lock out knees.',
            formTips: ['Feet shoulder-width on platform', 'Lower until 90° knee bend', 'Push through whole foot'],
            youtube: yt('leg press machine'),
            alternatives: [
              { name: 'Hack Squat', youtube: yt('hack squat machine') },
              { name: 'Bulgarian Split Squat', youtube: yt('bulgarian split squat') },
            ],
            restBetweenSets: 90,
          },
          {
            name: 'Walking Lunges',
            sets: '3', reps: '12 per leg', muscle: 'Quads / Glutes',
            notes: 'Step forward with control. Keep torso upright.',
            formTips: ['Front knee at 90°', 'Back knee hovers above floor', 'Push through front heel'],
            youtube: yt('walking lunges'),
            alternatives: [
              { name: 'Reverse Lunges', youtube: yt('reverse lunges') },
              { name: 'Step-Ups', youtube: yt('step ups dumbbell') },
            ],
            restBetweenSets: 90,
          },
          {
            name: 'Leg Curl (Hamstring Focus)',
            sets: '3', reps: '15', muscle: 'Hamstrings',
            notes: 'Slow and controlled. Squeeze hamstrings at peak contraction.',
            formTips: ['Adjust pad to sit above ankles', 'Don\'t use momentum', 'Full range of motion'],
            youtube: yt('lying leg curl machine'),
            alternatives: [
              { name: 'Romanian Deadlift', youtube: yt('romanian deadlift') },
              { name: 'Nordic Hamstring Curl', youtube: yt('nordic hamstring curl') },
            ],
            restBetweenSets: 60,
          },
          {
            name: 'Standing Calf Raises',
            sets: '3', reps: '20', muscle: 'Calves',
            notes: 'Full range of motion. Pause at the top for a 2-second squeeze.',
            formTips: ['Rise onto balls of feet', 'Lower below platform level', 'Controlled tempo'],
            youtube: yt('standing calf raises'),
            alternatives: [
              { name: 'Seated Calf Raises', youtube: yt('seated calf raises') },
              { name: 'Single-Leg Calf Raises', youtube: yt('single leg calf raises') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
      {
        title: 'Core',
        exercises: [
          {
            name: 'Cable Crunch',
            sets: '3', reps: '15', muscle: 'Abs',
            notes: 'Kneel facing away from cable. Crunch down using abs, not arms.',
            formTips: ['Keep hips stationary', 'Round spine, don\'t just hinge', 'Hold rope behind head'],
            youtube: yt('cable crunch abs'),
            alternatives: [
              { name: 'Weighted Crunch', youtube: yt('weighted crunch') },
              { name: 'Decline Sit-Up', youtube: yt('decline sit-up') },
            ],
            restBetweenSets: 45,
          },
          {
            name: 'Side Plank',
            sets: '2 per side', reps: '30–40 sec hold', muscle: 'Obliques',
            notes: 'Stack feet or stagger for stability. Keep hips lifted.',
            formTips: ['Elbow under shoulder', 'Body in a straight line', 'Don\'t let hips drop'],
            youtube: yt('side plank'),
            alternatives: [
              { name: 'Russian Twist', youtube: yt('russian twist') },
              { name: 'Pallof Press', youtube: yt('pallof press') },
            ],
            restBetweenSets: 45,
          },
        ],
      },
    ],
    preWorkout: [
      { name: 'Bodyweight Squats', duration: '30s', notes: 'Full range of motion, slow tempo' },
      { name: 'Leg Swings (front/back)', duration: '30s per leg', notes: 'Hold onto something for balance' },
      { name: 'Hip Circles', duration: '30s', notes: 'Both directions, open up hips' },
      { name: 'Walking Lunges (bodyweight)', duration: '30s', notes: 'Slow and controlled' },
      { name: 'Ankle Circles', duration: '30s', notes: 'Both directions, each ankle' },
      { name: 'Glute Bridges', duration: '30s', notes: 'Squeeze glutes at top, hold 2s' },
      { name: 'High Knees', duration: '30s', notes: 'Drive knees up, pump arms' },
      { name: 'Calf Raises (bodyweight)', duration: '30s', notes: 'Full range, slow tempo' },
      { name: 'Torso Twists', duration: '30s', notes: 'Rotate through spine' },
      { name: 'Cat-Cow Stretches', duration: '30s', notes: 'Mobilize the lower back' },
    ],
    postWorkout: [
      { name: 'Standing Quad Stretch', duration: '30s per leg', notes: 'Pull heel to glute' },
      { name: 'Standing Hamstring Stretch', duration: '30s per leg', notes: 'Foot on bench, lean forward' },
      { name: 'Pigeon Pose', duration: '30s per side', notes: 'Front shin parallel, sink hips' },
      { name: 'Standing Calf Stretch', duration: '30s per leg', notes: 'Step back, press heel down' },
      { name: 'Lying Glute Stretch', duration: '30s per side', notes: 'Figure-4 position on back' },
      { name: 'Hip Flexor Stretch (kneeling)', duration: '30s per side', notes: 'Back knee down, lean forward' },
      { name: 'Seated Forward Fold', duration: '30s', notes: 'Reach for toes, relax' },
      { name: 'Child\'s Pose', duration: '30s', notes: 'Knees wide, arms forward' },
    ],
  },
  {
    id: 'split-4',
    day: 'Day 4 — Saturday',
    title: 'Shoulders + Arms + Core',
    duration: '~75 min',
    muscles: ['Shoulders', 'Biceps', 'Triceps', 'Core', 'Neck'],
    sections: [
      {
        title: 'Shoulders',
        exercises: [
          {
            name: 'Overhead Dumbbell Press',
            sets: '4', reps: '10', muscle: 'Shoulders (Front/Mid Delt)',
            notes: 'Seated or standing. Press to full lockout overhead.',
            formTips: ['Start at ear level', 'Press straight up', 'Core braced throughout', 'Don\'t arch lower back'],
            youtube: yt('overhead dumbbell press seated'),
            alternatives: [
              { name: 'Barbell Overhead Press', youtube: yt('barbell overhead press') },
              { name: 'Arnold Press', youtube: yt('arnold press') },
            ],
            restBetweenSets: 90,
          },
          {
            name: 'Lateral Raise',
            sets: '3', reps: '12–15', muscle: 'Side Delts',
            notes: 'Light weight, high control. Lead with elbows.',
            formTips: ['Slight bend in elbows', 'Raise to shoulder height', 'Don\'t shrug shoulders'],
            youtube: yt('lateral raise dumbbell'),
            alternatives: [
              { name: 'Cable Lateral Raise', youtube: yt('cable lateral raise') },
              { name: 'Machine Lateral Raise', youtube: yt('machine lateral raise') },
            ],
            restBetweenSets: 60,
          },
          {
            name: 'Rear Delt Fly',
            sets: '3', reps: '12–15', muscle: 'Rear Delts',
            notes: 'Bend at hips, raise dumbbells to the sides.',
            formTips: ['Hinge forward 45°', 'Squeeze shoulder blades', 'Control the negative'],
            youtube: yt('rear delt fly dumbbell'),
            alternatives: [
              { name: 'Reverse Pec Deck', youtube: yt('reverse pec deck') },
              { name: 'Cable Reverse Fly', youtube: yt('cable reverse fly') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
      {
        title: 'Arms',
        exercises: [
          {
            name: 'Close-Grip Bench Press',
            sets: '3', reps: '10–12', muscle: 'Triceps / Chest',
            notes: 'Grip shoulder-width or slightly narrower. Elbows close to body.',
            formTips: ['Grip just inside shoulder width', 'Elbows tucked at 30°', 'Full range of motion'],
            youtube: yt('close grip bench press'),
            alternatives: [
              { name: 'Dips (Tricep Focus)', youtube: yt('tricep dips') },
              { name: 'Diamond Push-Ups', youtube: yt('diamond push-ups') },
            ],
            restBetweenSets: 150,
          },
          {
            name: 'Preacher Curl',
            sets: '3', reps: '10–12', muscle: 'Biceps (short head)',
            notes: 'Eliminates momentum. Full stretch at bottom.',
            formTips: ['Armpits snug on pad', 'Lower weight fully', 'Don\'t swing'],
            youtube: yt('preacher curl'),
            alternatives: [
              { name: 'Concentration Curl', youtube: yt('concentration curl') },
              { name: 'Spider Curl', youtube: yt('spider curl') },
            ],
            restBetweenSets: 60,
          },
          {
            name: 'Cable Tricep Kickbacks',
            sets: '3', reps: '15', muscle: 'Triceps',
            notes: 'Cable provides constant tension. Squeeze at full extension.',
            formTips: ['Hinge forward at hips', 'Upper arm parallel to floor', 'Extend fully, pause at top'],
            youtube: yt('cable tricep kickback'),
            alternatives: [
              { name: 'Dumbbell Kickback', youtube: yt('dumbbell tricep kickback') },
              { name: 'Overhead Cable Extension', youtube: yt('overhead cable extension') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
      {
        title: 'Core + Neck',
        exercises: [
          {
            name: 'Reverse Crunch',
            sets: '3', reps: '15', muscle: 'Lower Abs',
            notes: 'Curl hips off the bench. Focus on lower abdominal contraction.',
            formTips: ['Hands grip bench behind head', 'Lift hips, don\'t just raise knees', 'Slow negative'],
            youtube: yt('reverse crunch'),
            alternatives: [
              { name: 'Hanging Knee Raises', youtube: yt('hanging knee raises') },
              { name: 'Lying Leg Raises', youtube: yt('lying leg raises') },
            ],
            restBetweenSets: 45,
          },
          {
            name: 'Neck Curls (plate)',
            sets: '2', reps: '15–20', muscle: 'Neck Flexors',
            notes: 'Lie face up on bench with head off edge. Use a light plate with a towel.',
            formTips: ['Very light weight to start', 'Controlled range of motion', 'No jerky movements'],
            youtube: yt('neck curl plate exercise'),
            alternatives: [
              { name: 'Neck Isometric Holds', youtube: yt('neck isometric exercises') },
              { name: '4-Way Neck (manual resistance)', youtube: yt('4 way neck exercise') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
    ],
    preWorkout: [
      { name: 'Arm Circles (small → large)', duration: '30s', notes: 'Gradually increase diameter' },
      { name: 'Shoulder Shrugs', duration: '30s', notes: 'Up, hold, release. Warm up traps' },
      { name: 'Neck Rotations', duration: '30s', notes: 'Gentle, full circles both ways' },
      { name: 'Wrist Circles', duration: '30s', notes: 'Both directions, prep for gripping' },
      { name: 'Bodyweight Dips (chair)', duration: '30s', notes: 'Light dips to warm up triceps' },
      { name: 'Push-Ups', duration: '30s', notes: 'Slow tempo, shoulder activation' },
      { name: 'Jumping Jacks', duration: '30s', notes: 'Full range, elevate heart rate' },
      { name: 'Torso Twists', duration: '30s', notes: 'Rotate through thoracic spine' },
      { name: 'Overhead Reach + Side Bend', duration: '30s', notes: 'Alternate sides, stretch lats' },
      { name: 'Shadow Boxing', duration: '30s', notes: 'Light punches, engage shoulders and arms' },
    ],
    postWorkout: [
      { name: 'Overhead Tricep Stretch', duration: '30s per arm', notes: 'Pull elbow behind head' },
      { name: 'Cross-Body Shoulder Stretch', duration: '30s per arm', notes: 'Pull arm across chest' },
      { name: 'Bicep Wall Stretch', duration: '30s per arm', notes: 'Palm on wall, turn away' },
      { name: 'Neck Side Stretch', duration: '30s per side', notes: 'Ear to shoulder, gentle' },
      { name: 'Shoulder Shrug & Release', duration: '30s', notes: 'Shrug up, hold 5s, drop' },
      { name: 'Wrist Flexor Stretch', duration: '30s per hand', notes: 'Extend arm, pull fingers back' },
      { name: 'Child\'s Pose', duration: '30s', notes: 'Arms forward, sink hips' },
      { name: 'Standing Forward Fold', duration: '30s', notes: 'Full body decompress' },
    ],
  },
];

/* ================================================================
   WORKOUT DATA — Push/Pull 4‑Day Routine
   ================================================================ */

const pushPullRoutine: WorkoutDay[] = [
  {
    id: 'pp-1',
    day: 'Day 1 — Monday',
    title: 'Push — Chest + Shoulders + Triceps',
    duration: '~70 min',
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    sections: [
      {
        title: 'Chest',
        exercises: [
          {
            name: 'Flat Barbell Bench Press',
            sets: '4', reps: '6–8', muscle: 'Chest',
            notes: 'Heavy compound. Focus on progressive overload each week.',
            formTips: ['Retract and depress scapulae', 'Leg drive through heels', 'Bar path: slight diagonal'],
            youtube: yt('flat barbell bench press'),
            alternatives: [
              { name: 'Dumbbell Bench Press', youtube: yt('dumbbell bench press') },
              { name: 'Floor Press', youtube: yt('floor press barbell') },
            ],
            restBetweenSets: 150,
          },
          {
            name: 'Incline Dumbbell Press',
            sets: '3', reps: '10–12', muscle: 'Upper Chest',
            notes: '30° incline. Full stretch at the bottom.',
            formTips: ['Neutral or slight pronation grip', 'Lower to chest level', 'Press to lockout'],
            youtube: yt('incline dumbbell press'),
            alternatives: [
              { name: 'Incline Barbell Press', youtube: yt('incline barbell press') },
              { name: 'Landmine Press', youtube: yt('landmine press') },
            ],
            restBetweenSets: 90,
          },
        ],
      },
      {
        title: 'Shoulders',
        exercises: [
          {
            name: 'Overhead Dumbbell Press',
            sets: '3', reps: '10', muscle: 'Shoulders',
            notes: 'Seated for stability. Press dumbbells overhead.',
            formTips: ['Core braced', 'Neutral spine', 'Full lockout at top'],
            youtube: yt('seated overhead dumbbell press'),
            alternatives: [
              { name: 'Barbell OHP', youtube: yt('standing barbell overhead press') },
              { name: 'Machine Shoulder Press', youtube: yt('machine shoulder press') },
            ],
            restBetweenSets: 90,
          },
          {
            name: 'Lateral Raise',
            sets: '3', reps: '15', muscle: 'Side Delts',
            notes: 'Control the weight. Slight lean forward for better contraction.',
            formTips: ['Lead with elbows', 'Pause at top', 'Slow eccentric'],
            youtube: yt('lateral raise'),
            alternatives: [
              { name: 'Cable Lateral Raise', youtube: yt('cable lateral raise') },
              { name: 'Machine Lateral Raise', youtube: yt('machine lateral raise') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
      {
        title: 'Triceps',
        exercises: [
          {
            name: 'Rope Pushdown',
            sets: '3', reps: '10–12', muscle: 'Triceps',
            notes: 'Elbows pinned. Split rope at the bottom.',
            formTips: ['Stand upright', 'Full extension', 'Squeeze at bottom'],
            youtube: yt('rope pushdown triceps'),
            alternatives: [
              { name: 'Straight Bar Pushdown', youtube: yt('straight bar pushdown') },
              { name: 'Dips', youtube: yt('tricep dips') },
            ],
            restBetweenSets: 60,
          },
          {
            name: 'Overhead Dumbbell Extension',
            sets: '3', reps: '12–15', muscle: 'Triceps (long head)',
            notes: 'Both hands on one dumbbell. Full stretch at bottom.',
            formTips: ['Elbows close to head', 'Lower behind head', 'Full stretch at bottom'],
            youtube: yt('overhead dumbbell extension'),
            alternatives: [
              { name: 'Skull Crushers', youtube: yt('skull crushers') },
              { name: 'Overhead Cable Extension', youtube: yt('overhead cable extension') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
    ],
    preWorkout: [
      { name: 'Arm Circles (small → large)', duration: '30s', notes: 'Progressively increase range' },
      { name: 'Push-Up to Downward Dog', duration: '30s', notes: 'Flow between positions' },
      { name: 'Shoulder Dislocates (towel)', duration: '30s', notes: 'Slow, controlled arcs' },
      { name: 'Scapular Push-Ups', duration: '30s', notes: 'Protract and retract in plank' },
      { name: 'Torso Twists', duration: '30s', notes: 'Thoracic rotation' },
      { name: 'Bodyweight Push-Ups', duration: '30s', notes: 'Slow tempo activation' },
      { name: 'Jumping Jacks', duration: '30s', notes: 'Elevate heart rate' },
      { name: 'Shoulder Blade Squeezes', duration: '30s', notes: 'Hold 3s each' },
      { name: 'Inchworms', duration: '30s', notes: 'Walk hands out and back' },
      { name: 'High Knees', duration: '30s', notes: 'Drive knees up' },
    ],
    postWorkout: [
      { name: 'Doorway Chest Stretch', duration: '30s per side', notes: 'Arm at 90°, lean in' },
      { name: 'Tricep Overhead Stretch', duration: '30s per arm', notes: 'Elbow behind head' },
      { name: 'Cross-Body Shoulder Stretch', duration: '30s per arm', notes: 'Arm across chest' },
      { name: 'Child\'s Pose', duration: '30s', notes: 'Arms extended, relax' },
      { name: 'Cobra Stretch', duration: '30s', notes: 'Hips on floor, spine extended' },
      { name: 'Neck Side Stretch', duration: '30s per side', notes: 'Gentle, ear to shoulder' },
      { name: 'Wrist Flexor Stretch', duration: '30s per hand', notes: 'Extend arm, pull fingers' },
      { name: 'Standing Forward Fold', duration: '30s', notes: 'Decompress spine' },
    ],
  },
  {
    id: 'pp-2',
    day: 'Day 2 — Tuesday',
    title: 'Pull — Back + Biceps + Rear Delts',
    duration: '~70 min',
    muscles: ['Back', 'Biceps', 'Rear Delts'],
    sections: [
      {
        title: 'Back',
        exercises: [
          {
            name: 'Barbell Row',
            sets: '4', reps: '8–10', muscle: 'Upper/Mid Back',
            notes: 'Hinge at hips, pull to lower chest. Keep back flat.',
            formTips: ['45° torso angle', 'Drive elbows past torso', 'Squeeze at top'],
            youtube: yt('barbell row bent over'),
            alternatives: [
              { name: 'Pendlay Row', youtube: yt('pendlay row') },
              { name: 'T-Bar Row', youtube: yt('t-bar row') },
            ],
            restBetweenSets: 150,
          },
          {
            name: 'Lat Pulldown',
            sets: '3', reps: '10–12', muscle: 'Lats',
            notes: 'Wide grip, pull to upper chest.',
            formTips: ['Lean back slightly', 'Initiate with lats', 'Full stretch at top'],
            youtube: yt('lat pulldown'),
            alternatives: [
              { name: 'Pull-Ups', youtube: yt('pull-ups') },
              { name: 'Close-Grip Pulldown', youtube: yt('close grip lat pulldown') },
            ],
            restBetweenSets: 90,
          },
          {
            name: 'Seated Cable Row',
            sets: '3', reps: '10–12', muscle: 'Mid Back',
            notes: 'Close grip or V-bar attachment.',
            formTips: ['Chest up', 'Pull to lower sternum', 'Slow negative'],
            youtube: yt('seated cable row'),
            alternatives: [
              { name: 'One-Arm Dumbbell Row', youtube: yt('one arm dumbbell row') },
              { name: 'Chest-Supported Row', youtube: yt('chest supported row') },
            ],
            restBetweenSets: 90,
          },
        ],
      },
      {
        title: 'Rear Delts',
        exercises: [
          {
            name: 'Face Pulls',
            sets: '3', reps: '15–20', muscle: 'Rear Delts / Rotator Cuff',
            notes: 'High cable. External rotation at end.',
            formTips: ['Rope at face height', 'Pull apart at end range', 'Elbows high'],
            youtube: yt('face pulls cable'),
            alternatives: [
              { name: 'Reverse Pec Deck', youtube: yt('reverse pec deck') },
              { name: 'Bent-Over Rear Delt Fly', youtube: yt('bent over rear delt fly') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
      {
        title: 'Biceps',
        exercises: [
          {
            name: 'Barbell Curl',
            sets: '3', reps: '10–12', muscle: 'Biceps',
            notes: 'Strict form, no swinging.',
            formTips: ['Elbows pinned', 'Full ROM', 'Squeeze at top'],
            youtube: yt('barbell curl'),
            alternatives: [
              { name: 'EZ-Bar Curl', youtube: yt('ez bar curl') },
              { name: 'Dumbbell Curl', youtube: yt('dumbbell curl') },
            ],
            restBetweenSets: 60,
          },
          {
            name: 'Incline Dumbbell Curl',
            sets: '3', reps: '12–15', muscle: 'Biceps (long head)',
            notes: '45° incline bench. Great stretch at the bottom.',
            formTips: ['Let arms hang naturally', 'Curl without moving elbows', 'Full stretch at bottom'],
            youtube: yt('incline dumbbell curl'),
            alternatives: [
              { name: 'Hammer Curl', youtube: yt('hammer curl') },
              { name: 'Cable Curl', youtube: yt('cable curl') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
    ],
    preWorkout: [
      { name: 'Arm Circles', duration: '30s', notes: 'Warm up shoulder joint' },
      { name: 'Scapular Pull-Ups', duration: '30s', notes: 'Hang, squeeze shoulder blades' },
      { name: 'Cat-Cow Stretches', duration: '30s', notes: 'Mobilize thoracic spine' },
      { name: 'Superman Holds', duration: '30s', notes: 'Prone, lift arms and legs' },
      { name: 'Wrist Circles', duration: '30s', notes: 'Both directions' },
      { name: 'Bodyweight Reverse Fly', duration: '30s', notes: 'Hinge, arms out' },
      { name: 'Shoulder Dislocates (towel)', duration: '30s', notes: 'Slow arcs overhead' },
      { name: 'Torso Twists', duration: '30s', notes: 'Rotate through spine' },
      { name: 'High Knees', duration: '30s', notes: 'Elevate heart rate' },
      { name: 'Doorway Chest Stretch', duration: '30s', notes: 'Open chest for pulling' },
    ],
    postWorkout: [
      { name: 'Child\'s Pose', duration: '30s', notes: 'Arms extended, relax back' },
      { name: 'Lat Stretch (doorframe)', duration: '30s per side', notes: 'Grab overhead, lean away' },
      { name: 'Doorway Bicep Stretch', duration: '30s per arm', notes: 'Arm back on wall, rotate' },
      { name: 'Cross-Body Shoulder Stretch', duration: '30s per arm', notes: 'Arm across chest' },
      { name: 'Cat Stretch', duration: '30s', notes: 'Round upper back, hold' },
      { name: 'Lying Spinal Twist', duration: '30s per side', notes: 'Knees to side' },
      { name: 'Seated Forward Fold', duration: '30s', notes: 'Reach for toes' },
      { name: 'Neck Rolls', duration: '30s', notes: 'Gentle circles' },
    ],
  },
  {
    id: 'pp-3',
    day: 'Day 3 — Thursday',
    title: 'Legs + Core',
    duration: '~75 min',
    muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Core'],
    sections: [
      {
        title: 'Quads & Glutes',
        exercises: [
          {
            name: 'Barbell Squats',
            sets: '4', reps: '6–8', muscle: 'Quads / Glutes',
            notes: 'Heavy compound. Progressive overload is key.',
            formTips: ['Break at hips and knees simultaneously', 'Knees track toes', 'Chest up, brace core'],
            youtube: yt('barbell squat'),
            alternatives: [
              { name: 'Front Squat', youtube: yt('front squat') },
              { name: 'Leg Press', youtube: yt('leg press') },
            ],
            restBetweenSets: 150,
          },
          {
            name: 'Bulgarian Split Squat',
            sets: '3', reps: '10–12 per leg', muscle: 'Quads / Glutes',
            notes: 'Rear foot elevated on bench. Great for imbalances.',
            formTips: ['Front foot far enough forward', 'Drop back knee down', 'Torso upright'],
            youtube: yt('bulgarian split squat'),
            alternatives: [
              { name: 'Walking Lunges', youtube: yt('walking lunges') },
              { name: 'Step-Ups', youtube: yt('dumbbell step ups') },
            ],
            restBetweenSets: 90,
          },
          {
            name: 'Leg Extension',
            sets: '3', reps: '12–15', muscle: 'Quads',
            notes: 'Isolation exercise. Squeeze at the top.',
            formTips: ['Adjust pad to sit above ankles', 'Don\'t lock out aggressively', 'Controlled tempo'],
            youtube: yt('leg extension machine'),
            alternatives: [
              { name: 'Sissy Squat', youtube: yt('sissy squat') },
              { name: 'Wall Sit', youtube: yt('wall sit exercise') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
      {
        title: 'Hamstrings & Calves',
        exercises: [
          {
            name: 'Romanian Deadlift',
            sets: '3', reps: '10–12', muscle: 'Hamstrings / Glutes',
            notes: 'Hinge at hips, slight knee bend. Feel the hamstring stretch.',
            formTips: ['Bar stays close to body', 'Push hips back', 'Neutral spine throughout'],
            youtube: yt('romanian deadlift'),
            alternatives: [
              { name: 'Stiff-Leg Deadlift', youtube: yt('stiff leg deadlift') },
              { name: 'Good Mornings', youtube: yt('barbell good mornings') },
            ],
            restBetweenSets: 150,
          },
          {
            name: 'Lying Leg Curl',
            sets: '3', reps: '12–15', muscle: 'Hamstrings',
            notes: 'Squeeze at peak. Don\'t let hips rise off pad.',
            formTips: ['Hips pressed into pad', 'Full range of motion', 'Slow negative'],
            youtube: yt('lying leg curl'),
            alternatives: [
              { name: 'Seated Leg Curl', youtube: yt('seated leg curl') },
              { name: 'Nordic Curl', youtube: yt('nordic curl') },
            ],
            restBetweenSets: 60,
          },
          {
            name: 'Standing Calf Raises',
            sets: '4', reps: '15–20', muscle: 'Calves',
            notes: 'Full ROM. Pause at top and bottom.',
            formTips: ['Rise onto balls of feet', 'Full stretch at bottom', '2s pause at top'],
            youtube: yt('standing calf raises'),
            alternatives: [
              { name: 'Seated Calf Raises', youtube: yt('seated calf raises') },
              { name: 'Donkey Calf Raises', youtube: yt('donkey calf raises') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
      {
        title: 'Core',
        exercises: [
          {
            name: 'Hanging Leg Raises',
            sets: '3', reps: '12–15', muscle: 'Lower Abs',
            notes: 'Controlled movement. No swinging.',
            formTips: ['Curl pelvis up', 'Slow lowering', 'Engage abs throughout'],
            youtube: yt('hanging leg raises'),
            alternatives: [
              { name: 'Lying Leg Raises', youtube: yt('lying leg raises') },
              { name: 'Reverse Crunch', youtube: yt('reverse crunch') },
            ],
            restBetweenSets: 45,
          },
          {
            name: 'Plank',
            sets: '3', reps: '45–60 sec', muscle: 'Core',
            notes: 'Straight line from head to heels.',
            formTips: ['Engage everything', 'Don\'t sag', 'Breathe steadily'],
            youtube: yt('plank proper form'),
            alternatives: [
              { name: 'Dead Bug', youtube: yt('dead bug exercise') },
              { name: 'Ab Wheel Rollout', youtube: yt('ab wheel rollout') },
            ],
            restBetweenSets: 45,
          },
        ],
      },
    ],
    preWorkout: [
      { name: 'Bodyweight Squats', duration: '30s', notes: 'Full ROM, slow' },
      { name: 'Leg Swings (front/back)', duration: '30s per leg', notes: 'Dynamic hip flexor warm-up' },
      { name: 'Leg Swings (side to side)', duration: '30s per leg', notes: 'Open up adductors' },
      { name: 'Hip Circles', duration: '30s', notes: 'Both directions' },
      { name: 'Glute Bridges', duration: '30s', notes: 'Squeeze and hold at top' },
      { name: 'Walking Lunges', duration: '30s', notes: 'Bodyweight, slow' },
      { name: 'Ankle Circles', duration: '30s', notes: 'Both directions, each foot' },
      { name: 'Calf Raises (bodyweight)', duration: '30s', notes: 'Full range warm-up' },
      { name: 'High Knees', duration: '30s', notes: 'Get blood flowing' },
      { name: 'Torso Twists', duration: '30s', notes: 'Mobilize core' },
    ],
    postWorkout: [
      { name: 'Standing Quad Stretch', duration: '30s per leg', notes: 'Heel to glute' },
      { name: 'Standing Hamstring Stretch', duration: '30s per leg', notes: 'Foot elevated, lean forward' },
      { name: 'Pigeon Pose', duration: '30s per side', notes: 'Deep glute stretch' },
      { name: 'Hip Flexor Stretch', duration: '30s per side', notes: 'Kneeling, lean forward' },
      { name: 'Standing Calf Stretch', duration: '30s per leg', notes: 'Step back, press heel down' },
      { name: 'Lying Glute Stretch', duration: '30s per side', notes: 'Figure-4 on back' },
      { name: 'Child\'s Pose', duration: '30s', notes: 'Knees wide, relax' },
      { name: 'Seated Forward Fold', duration: '30s', notes: 'Reach for toes' },
    ],
  },
  {
    id: 'pp-4',
    day: 'Day 4 — Saturday',
    title: 'Upper Body + Arms',
    duration: '~70 min',
    muscles: ['Chest', 'Back', 'Biceps', 'Triceps', 'Neck', 'Thighs'],
    sections: [
      {
        title: 'Chest & Back Supersets',
        exercises: [
          {
            name: 'Incline Barbell Bench Press',
            sets: '3', reps: '8–10', muscle: 'Upper Chest',
            notes: 'Set bench at 30°. Focus on upper chest.',
            formTips: ['Shoulder blades retracted', 'Bar to upper chest', 'Full lockout'],
            youtube: yt('incline barbell bench press'),
            alternatives: [
              { name: 'Incline Dumbbell Press', youtube: yt('incline dumbbell press') },
              { name: 'Incline Smith Machine Press', youtube: yt('incline smith machine press') },
            ],
            restBetweenSets: 90,
          },
          {
            name: 'Pull-Ups',
            sets: '3', reps: '8–10', muscle: 'Lats / Upper Back',
            notes: 'Full dead hang to chin over bar. Use assistance if needed.',
            formTips: ['Dead hang start', 'Chin over bar', 'Controlled negative'],
            youtube: yt('pull-ups'),
            alternatives: [
              { name: 'Lat Pulldown', youtube: yt('lat pulldown') },
              { name: 'Chin-Ups', youtube: yt('chin-ups') },
            ],
            restBetweenSets: 90,
          },
          {
            name: 'Dumbbell Fly',
            sets: '3', reps: '12–15', muscle: 'Chest',
            notes: 'Focus on the stretch and squeeze.',
            formTips: ['Slight elbow bend', 'Lower until stretch is felt', 'Squeeze at top'],
            youtube: yt('dumbbell fly'),
            alternatives: [
              { name: 'Cable Fly', youtube: yt('cable fly') },
              { name: 'Pec Deck', youtube: yt('pec deck machine') },
            ],
            restBetweenSets: 90,
          },
          {
            name: 'T-Bar Row',
            sets: '3', reps: '10–12', muscle: 'Mid/Upper Back',
            notes: 'Keep torso angle consistent. Pull to chest.',
            formTips: ['Chest against pad if using machine', 'Squeeze shoulder blades', 'Controlled negative'],
            youtube: yt('t-bar row'),
            alternatives: [
              { name: 'Meadows Row', youtube: yt('meadows row') },
              { name: 'Barbell Row', youtube: yt('barbell row') },
            ],
            restBetweenSets: 90,
          },
        ],
      },
      {
        title: 'Arms',
        exercises: [
          {
            name: 'Close-Grip Bench Press',
            sets: '3', reps: '10–12', muscle: 'Triceps',
            notes: 'Great compound triceps builder.',
            formTips: ['Grip inside shoulder width', 'Elbows tucked', 'Full ROM'],
            youtube: yt('close grip bench press'),
            alternatives: [
              { name: 'Dips', youtube: yt('tricep dips') },
              { name: 'JM Press', youtube: yt('jm press') },
            ],
            restBetweenSets: 150,
          },
          {
            name: 'Preacher Curl',
            sets: '3', reps: '10–12', muscle: 'Biceps',
            notes: 'Eliminate momentum for strict bicep work.',
            formTips: ['Armpits on pad', 'Full stretch at bottom', 'Don\'t swing'],
            youtube: yt('preacher curl'),
            alternatives: [
              { name: 'Concentration Curl', youtube: yt('concentration curl') },
              { name: 'Spider Curl', youtube: yt('spider curl') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
      {
        title: 'Core + Neck',
        exercises: [
          {
            name: 'Cable Crunch',
            sets: '3', reps: '15', muscle: 'Abs',
            notes: 'Crunch with abs, not hip flexors.',
            formTips: ['Kneel facing away', 'Round spine', 'Hold rope behind head'],
            youtube: yt('cable crunch'),
            alternatives: [
              { name: 'Decline Sit-Up', youtube: yt('decline sit-up') },
              { name: 'Weighted Crunch', youtube: yt('weighted crunch') },
            ],
            restBetweenSets: 45,
          },
          {
            name: 'Neck Curls (plate)',
            sets: '2', reps: '15–20', muscle: 'Neck',
            notes: 'Light plate, towel for comfort. Build neck strength gradually.',
            formTips: ['Head off bench edge', 'Very controlled movement', 'Start very light'],
            youtube: yt('neck curl exercise'),
            alternatives: [
              { name: 'Neck Isometric Holds', youtube: yt('neck isometric holds') },
              { name: '4-Way Neck', youtube: yt('4 way neck exercise') },
            ],
            restBetweenSets: 60,
          },
        ],
      },
    ],
    preWorkout: [
      { name: 'Arm Circles', duration: '30s', notes: 'Both directions' },
      { name: 'Push-Up to Downward Dog', duration: '30s', notes: 'Flow movement' },
      { name: 'Scapular Pull-Ups', duration: '30s', notes: 'Activate back' },
      { name: 'Shoulder Dislocates (towel)', duration: '30s', notes: 'Slow, wide grip' },
      { name: 'Neck Rotations', duration: '30s', notes: 'Gentle circles' },
      { name: 'Wrist Circles', duration: '30s', notes: 'Prep for gripping' },
      { name: 'Bodyweight Push-Ups', duration: '30s', notes: 'Slow, activation' },
      { name: 'Jumping Jacks', duration: '30s', notes: 'Heart rate up' },
      { name: 'Torso Twists', duration: '30s', notes: 'Thoracic mobility' },
      { name: 'Shadow Boxing', duration: '30s', notes: 'Light, engage arms/shoulders' },
    ],
    postWorkout: [
      { name: 'Doorway Chest Stretch', duration: '30s per side', notes: 'Open chest' },
      { name: 'Lat Stretch (doorframe)', duration: '30s per side', notes: 'Lean away' },
      { name: 'Overhead Tricep Stretch', duration: '30s per arm', notes: 'Elbow behind head' },
      { name: 'Bicep Wall Stretch', duration: '30s per arm', notes: 'Palm on wall, rotate' },
      { name: 'Neck Side Stretch', duration: '30s per side', notes: 'Ear to shoulder' },
      { name: 'Cross-Body Shoulder Stretch', duration: '30s per arm', notes: 'Arm across chest' },
      { name: 'Child\'s Pose', duration: '30s', notes: 'Relax, decompress' },
      { name: 'Standing Forward Fold', duration: '30s', notes: 'Full body release' },
    ],
  },
];

/* ================================================================
   FULL WORKOUT SHOWCASES
   ================================================================ */

const fullWorkout1: FullWorkout = {
  id: 'full-1',
  title: 'Full Workout 1',
  subtitle: 'Hypertrophy Upper Body Power Session',
  duration: '~80 min (incl. warm-up & cooldown)',
  overview: 'A complete upper body session designed for maximum muscle stimulation. Combines heavy compounds with targeted isolation work. Ideal for a Monday or Thursday session.',
  muscles: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Neck'],
  warmup: [
    { name: 'Jumping Jacks', duration: '60s', notes: 'Elevate heart rate and body temperature' },
    { name: 'Arm Circles (small → large)', duration: '30s', notes: 'Forward then backward' },
    { name: 'Shoulder Dislocates (towel)', duration: '30s', notes: 'Slow, controlled arcs' },
    { name: 'Push-Up to Downward Dog', duration: '30s', notes: 'Dynamic flow' },
    { name: 'Scapular Push-Ups', duration: '30s', notes: 'Protract and retract in plank position' },
    { name: 'Inchworms', duration: '30s', notes: 'Walk hands out, walk feet in' },
    { name: 'Cat-Cow Stretches', duration: '30s', notes: 'Mobilize thoracic spine' },
    { name: 'Bodyweight Push-Ups (slow)', duration: '30s', notes: '3s down, 1s up' },
    { name: 'Bodyweight Reverse Fly', duration: '30s', notes: 'Hinge forward, raise arms' },
    { name: 'Neck Rotations', duration: '30s', notes: 'Gentle circles both directions' },
  ],
  sections: [
    {
      title: 'Block A — Heavy Compounds (20 min)',
      exercises: [
        {
          name: 'Flat Barbell Bench Press',
          sets: '4', reps: '6–8', muscle: 'Chest',
          notes: 'Progressive overload focus. Rest 2–3 min between sets.',
          formTips: ['Retract scapulae', 'Leg drive', 'Bar touches mid-chest'],
          youtube: yt('barbell bench press'),
          alternatives: [
            { name: 'Dumbbell Bench Press', youtube: yt('dumbbell bench press') },
            { name: 'Machine Chest Press', youtube: yt('machine chest press') },
          ],
          restBetweenSets: 150,
        },
        {
          name: 'Barbell Row',
          sets: '4', reps: '8–10', muscle: 'Back',
          notes: 'Superset with bench for efficiency. Rest 90s.',
          formTips: ['45° hinge', 'Pull to lower chest', 'Squeeze shoulder blades'],
          youtube: yt('barbell row'),
          alternatives: [
            { name: 'T-Bar Row', youtube: yt('t-bar row') },
            { name: 'Pendlay Row', youtube: yt('pendlay row') },
          ],
          restBetweenSets: 150,
        },
      ],
    },
    {
      title: 'Block B — Shoulder & Chest Volume (15 min)',
      exercises: [
        {
          name: 'Overhead Dumbbell Press',
          sets: '3', reps: '10', muscle: 'Shoulders',
          notes: 'Seated for stability. Full lockout.',
          formTips: ['Core braced', 'Press straight up', 'No excessive arch'],
          youtube: yt('seated overhead dumbbell press'),
          alternatives: [
            { name: 'Arnold Press', youtube: yt('arnold press') },
            { name: 'Machine Shoulder Press', youtube: yt('machine shoulder press') },
          ],
          restBetweenSets: 90,
        },
        {
          name: 'Incline Dumbbell Press',
          sets: '3', reps: '10–12', muscle: 'Upper Chest',
          notes: '30° incline. Mind-muscle connection.',
          formTips: ['Lower to chest slowly', 'Squeeze at top', 'Neutral wrists'],
          youtube: yt('incline dumbbell press'),
          alternatives: [
            { name: 'Incline Barbell Press', youtube: yt('incline barbell press') },
            { name: 'Landmine Press', youtube: yt('landmine press') },
          ],
          restBetweenSets: 90,
        },
        {
          name: 'Lateral Raise',
          sets: '3', reps: '15', muscle: 'Side Delts',
          notes: 'Light weight, high reps, great pump.',
          formTips: ['Lead with elbows', 'Slight lean', 'Controlled tempo'],
          youtube: yt('lateral raise'),
          alternatives: [
            { name: 'Cable Lateral Raise', youtube: yt('cable lateral raise') },
            { name: 'Machine Lateral Raise', youtube: yt('machine lateral raise') },
          ],
          restBetweenSets: 60,
        },
      ],
    },
    {
      title: 'Block C — Back & Rear Delts (12 min)',
      exercises: [
        {
          name: 'Lat Pulldown',
          sets: '3', reps: '10–12', muscle: 'Lats',
          notes: 'Wide grip for lat width.',
          formTips: ['Lean back slightly', 'Pull to upper chest', 'Full stretch'],
          youtube: yt('lat pulldown'),
          alternatives: [
            { name: 'Pull-Ups', youtube: yt('pull-ups') },
            { name: 'Straight-Arm Pulldown', youtube: yt('straight arm pulldown') },
          ],
          restBetweenSets: 90,
        },
        {
          name: 'Face Pulls',
          sets: '3', reps: '15–20', muscle: 'Rear Delts',
          notes: 'Shoulder health and posture. Don\'t skip.',
          formTips: ['High cable', 'External rotate at end', 'Elbows high'],
          youtube: yt('face pulls'),
          alternatives: [
            { name: 'Rear Delt Fly', youtube: yt('rear delt fly') },
            { name: 'Reverse Pec Deck', youtube: yt('reverse pec deck') },
          ],
          restBetweenSets: 60,
        },
      ],
    },
    {
      title: 'Block D — Arms Superset (12 min)',
      exercises: [
        {
          name: 'Barbell Curl',
          sets: '3', reps: '10–12', muscle: 'Biceps',
          notes: 'Superset with pushdowns. Rest 60s after both.',
          formTips: ['Strict form', 'Full ROM', 'Squeeze at top'],
          youtube: yt('barbell curl'),
          alternatives: [
            { name: 'EZ-Bar Curl', youtube: yt('ez bar curl') },
            { name: 'Dumbbell Curl', youtube: yt('dumbbell curl') },
          ],
          restBetweenSets: 60,
        },
        {
          name: 'Rope Pushdown',
          sets: '3', reps: '10–12', muscle: 'Triceps',
          notes: 'Superset with curls. Split rope at bottom.',
          formTips: ['Elbows pinned', 'Full extension', 'Squeeze at bottom'],
          youtube: yt('rope pushdown'),
          alternatives: [
            { name: 'Skull Crushers', youtube: yt('skull crushers') },
            { name: 'Dips', youtube: yt('tricep dips') },
          ],
          restBetweenSets: 60,
        },
        {
          name: 'Dumbbell Hammer Curl',
          sets: '2', reps: '12–15', muscle: 'Brachialis',
          notes: 'Finisher. Neutral grip for brachialis emphasis.',
          formTips: ['No swing', 'Controlled tempo', 'Full range'],
          youtube: yt('hammer curl'),
          alternatives: [
            { name: 'Cable Rope Curl', youtube: yt('cable rope curl') },
            { name: 'Reverse Curl', youtube: yt('reverse curl') },
          ],
          restBetweenSets: 60,
        },
      ],
    },
    {
      title: 'Block E — Core & Neck (8 min)',
      exercises: [
        {
          name: 'Hanging Leg Raises',
          sets: '3', reps: '12–15', muscle: 'Abs',
          notes: 'Controlled. Curl pelvis up.',
          formTips: ['No swinging', 'Slow negative', 'Breathe out on raise'],
          youtube: yt('hanging leg raises'),
          alternatives: [
            { name: 'Cable Crunch', youtube: yt('cable crunch') },
            { name: 'Ab Wheel Rollout', youtube: yt('ab wheel') },
          ],
          restBetweenSets: 45,
        },
        {
          name: 'Neck Curls (plate)',
          sets: '2', reps: '15–20', muscle: 'Neck',
          notes: 'Light weight. Build gradually over weeks.',
          formTips: ['Controlled ROM', 'Towel under plate', 'Head off bench edge'],
          youtube: yt('neck curl plate'),
          alternatives: [
            { name: 'Neck Isometric Holds', youtube: yt('neck isometrics') },
            { name: 'Shrugs', youtube: yt('barbell shrugs') },
          ],
          restBetweenSets: 60,
        },
      ],
    },
  ],
  cooldown: [
    { name: 'Doorway Chest Stretch', duration: '30s per side', notes: 'Arm at 90°, lean forward' },
    { name: 'Lat Stretch (doorframe)', duration: '30s per side', notes: 'Grab overhead, lean away' },
    { name: 'Overhead Tricep Stretch', duration: '30s per arm', notes: 'Pull elbow behind head' },
    { name: 'Cross-Body Shoulder Stretch', duration: '30s per arm', notes: 'Arm across chest' },
    { name: 'Bicep Wall Stretch', duration: '30s per arm', notes: 'Palm on wall, turn away' },
    { name: 'Neck Side Stretch', duration: '30s per side', notes: 'Ear to shoulder, gently' },
    { name: 'Child\'s Pose', duration: '45s', notes: 'Sink hips, arms extended' },
    { name: 'Standing Forward Fold', duration: '30s', notes: 'Full body decompress' },
  ],
};

const fullWorkout2: FullWorkout = {
  id: 'full-2',
  title: 'Full Workout 2',
  subtitle: 'Strength & Power Lower Body + Core Session',
  duration: '~75 min (incl. warm-up & cooldown)',
  overview: 'A complete lower body session with core emphasis. Combines heavy squats and deadlift variations with targeted isolation for quads, hamstrings, calves, and core. Perfect for building a strong foundation.',
  muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Thighs'],
  warmup: [
    { name: 'Bodyweight Squats', duration: '60s', notes: 'Full range of motion, groove the pattern' },
    { name: 'Leg Swings (front/back)', duration: '30s per leg', notes: 'Dynamic hip flexor warm-up' },
    { name: 'Leg Swings (side to side)', duration: '30s per leg', notes: 'Open adductors' },
    { name: 'Hip Circles', duration: '30s', notes: 'Both directions, full circles' },
    { name: 'Glute Bridges', duration: '30s', notes: 'Squeeze and hold 3s at top' },
    { name: 'Walking Lunges (bodyweight)', duration: '30s', notes: 'Slow and controlled steps' },
    { name: 'Ankle Circles', duration: '30s', notes: 'Both feet, both directions' },
    { name: 'Cat-Cow Stretches', duration: '30s', notes: 'Mobilize lumbar spine' },
    { name: 'Dead Bugs', duration: '30s', notes: 'Activate deep core stabilizers' },
    { name: 'High Knees', duration: '30s', notes: 'Get blood flowing to legs' },
  ],
  sections: [
    {
      title: 'Block A — Heavy Compounds (20 min)',
      exercises: [
        {
          name: 'Barbell Back Squat',
          sets: '4', reps: '6–8', muscle: 'Quads / Glutes',
          notes: 'The king of exercises. Rest 2–3 min. Focus on depth and control.',
          formTips: ['Feet shoulder-width or slightly wider', 'Break at hips and knees together', 'Drive through whole foot', 'Chest stays up'],
          youtube: yt('barbell back squat'),
          alternatives: [
            { name: 'Front Squat', youtube: yt('front squat') },
            { name: 'Safety Bar Squat', youtube: yt('safety bar squat') },
          ],
          restBetweenSets: 150,
        },
        {
          name: 'Romanian Deadlift',
          sets: '4', reps: '8–10', muscle: 'Hamstrings / Glutes',
          notes: 'Posterior chain builder. Bar stays close to body.',
          formTips: ['Soft knees', 'Push hips back', 'Feel hamstring stretch', 'Neutral spine'],
          youtube: yt('romanian deadlift'),
          alternatives: [
            { name: 'Conventional Deadlift', youtube: yt('conventional deadlift') },
            { name: 'Trap Bar Deadlift', youtube: yt('trap bar deadlift') },
          ],
          restBetweenSets: 150,
        },
      ],
    },
    {
      title: 'Block B — Unilateral & Quad Focus (15 min)',
      exercises: [
        {
          name: 'Bulgarian Split Squat',
          sets: '3', reps: '10–12 per leg', muscle: 'Quads / Glutes',
          notes: 'Addresses imbalances. Dumbbells or bodyweight.',
          formTips: ['Rear foot on bench', 'Drop back knee straight down', 'Upright torso'],
          youtube: yt('bulgarian split squat'),
          alternatives: [
            { name: 'Walking Lunges', youtube: yt('walking lunges dumbbell') },
            { name: 'Step-Ups', youtube: yt('step ups') },
          ],
          restBetweenSets: 90,
        },
        {
          name: 'Leg Press',
          sets: '3', reps: '12–15', muscle: 'Quads',
          notes: 'High volume quad work. Feet placement affects emphasis.',
          formTips: ['Lower back pressed into pad', 'Don\'t lock knees', 'Full range'],
          youtube: yt('leg press'),
          alternatives: [
            { name: 'Hack Squat', youtube: yt('hack squat') },
            { name: 'Leg Extension', youtube: yt('leg extension') },
          ],
          restBetweenSets: 90,
        },
      ],
    },
    {
      title: 'Block C — Hamstring & Calf Isolation (12 min)',
      exercises: [
        {
          name: 'Lying Leg Curl',
          sets: '3', reps: '12–15', muscle: 'Hamstrings',
          notes: 'Isolation work. Squeeze at peak, slow negative.',
          formTips: ['Hips on pad', 'Don\'t jerk weight', 'Controlled throughout'],
          youtube: yt('lying leg curl'),
          alternatives: [
            { name: 'Seated Leg Curl', youtube: yt('seated leg curl') },
            { name: 'Nordic Curl', youtube: yt('nordic hamstring curl') },
          ],
          restBetweenSets: 60,
        },
        {
          name: 'Standing Calf Raises',
          sets: '4', reps: '15–20', muscle: 'Calves',
          notes: 'Full stretch at bottom, hard squeeze at top.',
          formTips: ['Rise onto toes fully', 'Lower below platform', '2s pause at top and bottom'],
          youtube: yt('standing calf raises'),
          alternatives: [
            { name: 'Seated Calf Raises', youtube: yt('seated calf raises') },
            { name: 'Single-Leg Calf Raises', youtube: yt('single leg calf raises') },
          ],
          restBetweenSets: 60,
        },
      ],
    },
    {
      title: 'Block D — Core Circuit (10 min)',
      exercises: [
        {
          name: 'Cable Crunch',
          sets: '3', reps: '15', muscle: 'Abs',
          notes: 'Heavy abs work. Round the spine, not the hips.',
          formTips: ['Kneel facing away', 'Crunch down with abs', 'Don\'t pull with arms'],
          youtube: yt('cable crunch'),
          alternatives: [
            { name: 'Decline Sit-Up', youtube: yt('decline sit-up') },
            { name: 'Hanging Leg Raises', youtube: yt('hanging leg raises') },
          ],
          restBetweenSets: 45,
        },
        {
          name: 'Side Plank',
          sets: '2 per side', reps: '30–45 sec', muscle: 'Obliques',
          notes: 'Anti-lateral flexion. Build oblique stability.',
          formTips: ['Elbow under shoulder', 'Hips elevated', 'Straight line body'],
          youtube: yt('side plank'),
          alternatives: [
            { name: 'Russian Twist', youtube: yt('russian twist') },
            { name: 'Pallof Press', youtube: yt('pallof press') },
          ],
          restBetweenSets: 45,
        },
        {
          name: 'Dead Bug',
          sets: '3', reps: '10 per side', muscle: 'Deep Core',
          notes: 'Keep lower back pressed into floor. Opposite arm/leg extension.',
          formTips: ['Low back stays flat', 'Breathe out as you extend', 'Controlled tempo'],
          youtube: yt('dead bug exercise'),
          alternatives: [
            { name: 'Bird Dog', youtube: yt('bird dog exercise') },
            { name: 'Plank', youtube: yt('plank exercise') },
          ],
          restBetweenSets: 45,
        },
      ],
    },
  ],
  cooldown: [
    { name: 'Standing Quad Stretch', duration: '30s per leg', notes: 'Pull heel to glute, knees together' },
    { name: 'Standing Hamstring Stretch', duration: '30s per leg', notes: 'Foot on bench, hinge forward' },
    { name: 'Pigeon Pose', duration: '45s per side', notes: 'Deep glute and hip stretch' },
    { name: 'Hip Flexor Stretch (kneeling)', duration: '30s per side', notes: 'Back knee down, lean forward' },
    { name: 'Standing Calf Stretch', duration: '30s per leg', notes: 'Against wall, press heel down' },
    { name: 'Lying Spinal Twist', duration: '30s per side', notes: 'Knees to side, shoulders flat' },
    { name: 'Child\'s Pose', duration: '45s', notes: 'Knees wide, arms forward, sink hips' },
    { name: 'Seated Forward Fold', duration: '30s', notes: 'Reach for toes, breathe deeply' },
  ],
};

/* ================================================================
   BADGE COLOR MAPPING
   ================================================================ */

function badgeClass(muscle: string): string {
  const m = muscle.toLowerCase();
  if (m.includes('chest')) return 'badge-blue';
  if (m.includes('back') || m.includes('lat')) return 'badge-emerald';
  if (m.includes('shoulder') || m.includes('delt')) return 'badge-violet';
  if (m.includes('bicep') || m.includes('tricep') || m.includes('arm')) return 'badge-amber';
  if (m.includes('leg') || m.includes('quad') || m.includes('ham') || m.includes('glute') || m.includes('calf') || m.includes('thigh')) return 'badge-rose';
  if (m.includes('core') || m.includes('ab')) return 'badge-zinc';
  if (m.includes('neck')) return 'badge-zinc';
  return 'badge-zinc';
}

/* ================================================================
   REST TIMER — Web Audio API beep + smart defaults
   ================================================================ */

function playBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.35, ctx.currentTime + i * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.25 + 0.2);
      osc.start(ctx.currentTime + i * 0.25);
      osc.stop(ctx.currentTime + i * 0.25 + 0.2);
    }
  } catch {
    // Audio not supported
  }
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function restCategoryLabel(seconds: number): string {
  if (seconds >= 150) return 'Heavy compound';
  if (seconds >= 90) return 'Moderate compound';
  if (seconds >= 60) return 'Isolation';
  if (seconds >= 45) return 'Core / Abs';
  return 'Rest';
}

function restCategoryColor(seconds: number): string {
  if (seconds >= 150) return 'text-red-400';
  if (seconds >= 90) return 'text-amber-400';
  if (seconds >= 60) return 'text-brand-400';
  return 'text-emerald-400';
}

interface TimerEventDetail {
  seconds: number;
  label: string;
}

function RestTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [finished, setFinished] = useState(false);
  const [label, setLabel] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback((s: number, lbl?: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSeconds(Math.max(15, s));
    setRunning(true);
    setFinished(false);
    setExpanded(false);
    if (lbl !== undefined) setLabel(lbl);
  }, []);

  const adjustTime = useCallback((delta: number) => {
    setSeconds((prev) => Math.max(15, prev + delta));
  }, []);

  const cancelTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
    setSeconds(0);
    setFinished(false);
    setLabel('');
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<TimerEventDetail>).detail;
      startTimer(detail.seconds, detail.label);
    };
    window.addEventListener('start-rest-timer', handler);
    return () => window.removeEventListener('start-rest-timer', handler);
  }, [startTimer]);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            setRunning(false);
            setFinished(true);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, seconds > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (finished) {
      const t = setTimeout(() => setFinished(false), 3000);
      return () => clearTimeout(t);
    }
  }, [finished]);

  const isActive = running || seconds > 0 || finished;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Timer display when running or finished */}
      {isActive && (
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/60 rounded-2xl shadow-2xl shadow-black/40 p-4 min-w-[220px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Rest Timer</span>
            <button
              onClick={cancelTimer}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <IconX />
            </button>
          </div>
          {label && (
            <p className="text-[11px] text-zinc-500 mb-1">{label}</p>
          )}
          <div className={`text-4xl font-mono font-bold text-center py-2 ${finished ? 'text-emerald-400' : running ? 'text-brand-300' : 'text-zinc-300'}`}>
            {finished ? '✓ Done!' : formatTime(seconds)}
          </div>
          {running && (
            <div className="space-y-2 mt-2">
              {/* +15s / -15s adjustment buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => adjustTime(-15)}
                  className="px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  −15s
                </button>
                <button
                  onClick={() => adjustTime(15)}
                  className="px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  +15s
                </button>
              </div>
              <button
                onClick={cancelTimer}
                className="w-full px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expanded preset panel */}
      {expanded && !isActive && (
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/60 rounded-2xl shadow-2xl shadow-black/40 p-4 min-w-[220px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Quick Timer</span>
            <button
              onClick={() => setExpanded(false)}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <IconX />
            </button>
          </div>
          <div className="space-y-1.5">
            {[
              { s: 150, cat: 'Heavy compound' },
              { s: 90, cat: 'Moderate compound' },
              { s: 60, cat: 'Isolation' },
              { s: 45, cat: 'Core / Abs' },
            ].map(({ s, cat }) => (
              <button
                key={s}
                onClick={() => startTimer(s, cat + ' · ' + formatTime(s))}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-brand-600/15 hover:bg-brand-600/25 text-brand-300 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                <span className="text-zinc-400 text-xs">{cat}</span>
                <span className="font-bold">{formatTime(s)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      {!isActive && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`p-3.5 rounded-full shadow-lg transition-all cursor-pointer ${
            expanded
              ? 'bg-brand-600 text-white shadow-brand-500/30'
              : 'bg-zinc-800/90 backdrop-blur-sm border border-zinc-700/60 text-zinc-400 hover:text-brand-300 hover:border-brand-500/40'
          }`}
        >
          <IconTimer className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

/* ================================================================
   REUSABLE COMPONENTS
   ================================================================ */

function Collapsible({
  title,
  badge,
  children,
  defaultOpen = false,
  variant = 'default',
}: {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'section' | 'exercise';
}) {
  const [open, setOpen] = useState(defaultOpen);

  const baseClasses = {
    default: 'glass-card',
    section: 'bg-zinc-800/40 border border-zinc-700/40 rounded-xl',
    exercise: 'bg-zinc-800/30 border border-zinc-700/30 rounded-lg',
  };

  const padClasses = {
    default: 'px-5 py-4',
    section: 'px-4 py-3',
    exercise: 'px-4 py-3',
  };

  return (
    <div className={baseClasses[variant]}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-3 ${padClasses[variant]} text-left cursor-pointer group`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`font-semibold ${variant === 'exercise' ? 'text-sm' : 'text-base'} group-hover:text-brand-300 transition-colors`}>
            {title}
          </span>
          {badge}
        </div>
        <IconChevron open={open} className="text-zinc-500 shrink-0" />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`${padClasses[variant]} pt-0`}>{children}</div>
      </div>
    </div>
  );
}

function ExerciseCard({
  exercise,
  index,
  exerciseKey,
  checked,
  onToggle,
}: {
  exercise: Exercise;
  index: number;
  exerciseKey: string;
  checked: boolean;
  onToggle: (key: string) => void;
}) {
  const [showAlts, setShowAlts] = useState(false);

  const rest = exercise.restBetweenSets;
  const catLabel = restCategoryLabel(rest);
  const catColor = restCategoryColor(rest);

  const handleStartRest = () => {
    window.dispatchEvent(
      new CustomEvent<TimerEventDetail>('start-rest-timer', {
        detail: { seconds: rest, label: `${catLabel} · ${formatTime(rest)}` },
      }),
    );
  };

  return (
    <div className={`bg-zinc-800/30 border rounded-lg p-4 transition-all duration-200 ${checked ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-zinc-700/30'}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(exerciseKey)}
          className={`mt-0.5 shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer ${
            checked
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'border-zinc-600 hover:border-brand-400 bg-zinc-800/60'
          }`}
        >
          {checked && <IconCheck className="w-3.5 h-3.5" />}
        </button>

        {/* Exercise content */}
        <div className="flex-1 min-w-0">
          {/* Header row: name, YouTube, badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold text-sm transition-all ${checked ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
              {index + 1}. {exercise.name}
            </span>
            <a
              href={exercise.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded text-[10px] font-medium transition-colors"
              title="Watch Demo"
            >
              <IconPlay className="w-3 h-3" />
              <span className="hidden sm:inline">Demo</span>
            </a>
            <span className="px-2 py-0.5 rounded-md bg-zinc-700/50 text-zinc-200 text-xs font-bold tracking-wide">{exercise.sets}×{exercise.reps}</span>
            <span className={`${badgeClass(exercise.muscle)} text-[11px]`}>{exercise.muscle}</span>
          </div>

          {/* Form tips — compact bullets, always visible */}
          <ul className={`mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 ${checked ? 'opacity-50' : ''}`}>
            {exercise.formTips.map((tip, i) => (
              <li key={i} className="text-xs text-zinc-400 flex items-start gap-1.5">
                <span className="text-brand-400 mt-px text-[8px]">●</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {/* Action row: Rest timer + Alternatives */}
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <button
              onClick={handleStartRest}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-700/40 hover:bg-zinc-700/60 rounded-lg text-[11px] font-medium transition-colors cursor-pointer group"
            >
              <IconTimer className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
              <span className="text-zinc-300">Rest {formatTime(rest)}</span>
              <span className={`${catColor} hidden sm:inline`}>· {catLabel}</span>
            </button>
            <button
              onClick={() => setShowAlts(!showAlts)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-600/15 hover:bg-brand-600/25 text-brand-300 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
            >
              <IconSwap className="w-3 h-3" />
              {showAlts ? 'Hide' : ''} Alternatives ({exercise.alternatives.length})
            </button>
          </div>

          {showAlts && (
            <div className="mt-2 bg-zinc-900/60 rounded-lg p-3 space-y-1.5 border border-zinc-700/30">
              {exercise.alternatives.map((alt, i) => (
                <a
                  key={i}
                  href={alt.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-zinc-300 hover:text-brand-300 transition-colors group"
                >
                  <IconPlay className="w-3 h-3 text-red-400 group-hover:text-red-300" />
                  <span>{alt.name}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActivationList({ moves, type }: { moves: ActivationMove[]; type: 'pre' | 'post' }) {
  return (
    <div className="space-y-2">
      {moves.map((move, i) => (
        <div
          key={i}
          className="flex items-start gap-3 px-3 py-2.5 bg-zinc-800/30 rounded-lg border border-zinc-700/20"
        >
          <span className={`mt-0.5 ${type === 'pre' ? 'text-amber-400' : 'text-emerald-400'} text-xs font-bold`}>
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-zinc-200">{move.name}</span>
              <span className="text-xs text-zinc-500">{move.duration}</span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">{move.notes}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkoutDayPanel({
  day,
  checkedExercises,
  onToggleExercise,
}: {
  day: WorkoutDay;
  checkedExercises: Set<string>;
  onToggleExercise: (key: string) => void;
}) {
  const totalExercises = day.sections.reduce((a, s) => a + s.exercises.length, 0);
  const completedExercises = day.sections.reduce((acc, sec, si) => {
    return acc + sec.exercises.filter((_, ei) => checkedExercises.has(`${day.id}::${si}::${ei}`)).length;
  }, 0);
  const allDone = completedExercises === totalExercises && totalExercises > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <h3 className="text-xl font-bold text-zinc-100">{day.day}</h3>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <IconClock />
          <span>{day.duration}</span>
        </div>
      </div>
      <h4 className="text-lg font-semibold text-gradient">{day.title}</h4>

      {/* Progress indicator */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${allDone ? 'bg-emerald-500' : 'bg-brand-500'}`}
            style={{ width: `${totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0}%` }}
          />
        </div>
        <span className={`text-sm font-semibold tabular-nums ${allDone ? 'text-emerald-400' : 'text-zinc-400'}`}>
          {completedExercises}/{totalExercises} done
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {day.muscles.map((m) => (
          <span key={m} className={badgeClass(m)}>{m}</span>
        ))}
      </div>

      <Collapsible
        title="Pre-Workout Activation (5 min)"
        badge={<span className="badge-amber text-[11px]">No bands</span>}
      >
        <ActivationList moves={day.preWorkout} type="pre" />
      </Collapsible>

      {day.sections.map((sec, si) => (
        <Collapsible key={si} variant="section" title={sec.title} defaultOpen>
          <div className="space-y-2 mt-2">
            {sec.exercises.map((ex, ei) => {
              const globalIndex = day.sections.slice(0, si).reduce((a, s) => a + s.exercises.length, 0) + ei;
              const exKey = `${day.id}::${si}::${ei}`;
              return (
                <ExerciseCard
                  key={ei}
                  exercise={ex}
                  index={globalIndex}
                  exerciseKey={exKey}
                  checked={checkedExercises.has(exKey)}
                  onToggle={onToggleExercise}
                />
              );
            })}
          </div>
        </Collapsible>
      ))}

      <Collapsible
        title="Post-Workout Stretch (5 min)"
        badge={<span className="badge-emerald text-[11px]">No bands</span>}
      >
        <ActivationList moves={day.postWorkout} type="post" />
      </Collapsible>
    </div>
  );
}

function FullWorkoutPanel({ workout }: { workout: FullWorkout }) {
  const [checkedExercises, setCheckedExercises] = useState<Set<string>>(new Set());

  const toggleExercise = useCallback((key: string) => {
    setCheckedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const totalExercises = workout.sections.reduce((a, s) => a + s.exercises.length, 0);
  const completedExercises = workout.sections.reduce((acc, sec, si) => {
    return acc + sec.exercises.filter((_, ei) => checkedExercises.has(`${workout.id}::${si}::${ei}`)).length;
  }, 0);
  const allDone = completedExercises === totalExercises && totalExercises > 0;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-bold text-zinc-100">{workout.title}</h3>
        <p className="text-lg text-gradient font-semibold mt-1">{workout.subtitle}</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <IconClock />
        <span>{workout.duration}</span>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">{workout.overview}</p>

      {/* Progress indicator */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${allDone ? 'bg-emerald-500' : 'bg-brand-500'}`}
            style={{ width: `${totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0}%` }}
          />
        </div>
        <span className={`text-sm font-semibold tabular-nums ${allDone ? 'text-emerald-400' : 'text-zinc-400'}`}>
          {completedExercises}/{totalExercises} done
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {workout.muscles.map((m) => (
          <span key={m} className={badgeClass(m)}>{m}</span>
        ))}
      </div>

      <Collapsible title="Warm-Up (5 min)" badge={<span className="badge-amber text-[11px]">No bands</span>}>
        <ActivationList moves={workout.warmup} type="pre" />
      </Collapsible>

      {workout.sections.map((sec, si) => (
        <Collapsible key={si} variant="section" title={sec.title} defaultOpen>
          <div className="space-y-2 mt-2">
            {sec.exercises.map((ex, ei) => {
              const exKey = `${workout.id}::${si}::${ei}`;
              return (
                <ExerciseCard
                  key={ei}
                  exercise={ex}
                  index={ei}
                  exerciseKey={exKey}
                  checked={checkedExercises.has(exKey)}
                  onToggle={toggleExercise}
                />
              );
            })}
          </div>
        </Collapsible>
      ))}

      <Collapsible title="Cooldown Stretch (5 min)" badge={<span className="badge-emerald text-[11px]">No bands</span>}>
        <ActivationList moves={workout.cooldown} type="post" />
      </Collapsible>
    </div>
  );
}

/* ================================================================
   PRE / POST WORKOUT OVERVIEW PAGES
   ================================================================ */

function PreWorkoutOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Pre-Workout Activation Routines</h2>
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
          5 minutes of dynamic activation specific to each day&apos;s target muscle groups.
          Elevate heart rate, activate target muscles, and prepare joints for heavy loading.
          <strong className="text-amber-300"> No bands required.</strong>
        </p>
      </div>
      <div className="grid gap-4">
        {splitRoutine.map((day) => (
          <Collapsible key={day.id} title={`${day.day} — ${day.title}`}>
            <ActivationList moves={day.preWorkout} type="pre" />
          </Collapsible>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-zinc-200 mb-3">Push/Pull Days</h3>
        <div className="grid gap-4">
          {pushPullRoutine.map((day) => (
            <Collapsible key={day.id} title={`${day.day} — ${day.title}`}>
              <ActivationList moves={day.preWorkout} type="pre" />
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
}

function PostWorkoutOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Post-Workout Stretching Routines</h2>
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
          5 minutes of static stretching targeting the muscles you just trained.
          Improve recovery, reduce soreness, and maintain flexibility.
          <strong className="text-emerald-300"> No bands required.</strong>
        </p>
      </div>
      <div className="grid gap-4">
        {splitRoutine.map((day) => (
          <Collapsible key={day.id} title={`${day.day} — ${day.title}`}>
            <ActivationList moves={day.postWorkout} type="post" />
          </Collapsible>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-zinc-200 mb-3">Push/Pull Days</h3>
        <div className="grid gap-4">
          {pushPullRoutine.map((day) => (
            <Collapsible key={day.id} title={`${day.day} — ${day.title}`}>
              <ActivationList moves={day.postWorkout} type="post" />
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   NAVIGATION & HOME
   ================================================================ */

interface NavItem {
  id: View;
  label: string;
  description: string;
  icon: ReactNode;
  color: string;
}

const navItems: NavItem[] = [
  {
    id: 'split',
    label: '4-Day Split',
    description: 'Chest/Tri, Back/Bi, Legs, Shoulders/Arms — classic bodybuilding split',
    icon: <IconDumbbell className="w-7 h-7" />,
    color: 'from-brand-500/20 to-brand-600/10 border-brand-500/30 hover:border-brand-400/50',
  },
  {
    id: 'pushpull',
    label: 'Push/Pull 4-Day',
    description: 'Push, Pull, Legs, Upper — movement-pattern based training',
    icon: <IconSwap className="w-7 h-7" />,
    color: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 hover:border-violet-400/50',
  },
  {
    id: 'full-workout-1',
    label: 'Full Workout 1',
    description: 'Hypertrophy Upper Body Power Session — complete session guide',
    icon: <IconTarget className="w-7 h-7" />,
    color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-400/50',
  },
  {
    id: 'full-workout-2',
    label: 'Full Workout 2',
    description: 'Strength & Power Lower Body + Core — complete session guide',
    icon: <IconTarget className="w-7 h-7" />,
    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-400/50',
  },
  {
    id: 'pre-workout',
    label: 'Pre-Workout Routines',
    description: '5-min activation routines (no bands) tailored to each day',
    icon: <IconFire className="w-7 h-7" />,
    color: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 hover:border-rose-400/50',
  },
  {
    id: 'post-workout',
    label: 'Post-Workout Routines',
    description: '5-min stretching routines (no bands) for recovery',
    icon: <IconSnow className="w-7 h-7" />,
    color: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 hover:border-teal-400/50',
  },
];

function HomePage({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium">
          <IconDumbbell className="w-4 h-4" />
          Strength &amp; Muscle Building
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          <span className="text-gradient">IronForge</span>
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          A structured workout program focused on strength and muscle building.
          Build strength, add muscle, and form lasting habits through clear structure and progressive overload.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-zinc-500">
          <span className="badge-zinc">4 Days/Week</span>
          <span className="badge-zinc">60–90 min/session</span>
          <span className="badge-zinc">All Muscle Groups</span>
          <span className="badge-zinc">Progressive Overload</span>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`text-left p-5 rounded-2xl bg-gradient-to-br ${item.color} border backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer group`}
          >
            <div className="text-zinc-300 group-hover:text-zinc-100 transition-colors mb-3">{item.icon}</div>
            <h3 className="font-bold text-zinc-100 text-lg mb-1">{item.label}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
          </button>
        ))}
      </div>

      
    </div>
  );
}

/* ================================================================
   ROUTINE PAGES
   ================================================================ */

function SplitPage() {
  const [activeDay, setActiveDay] = useState(0);
  const [checkedExercises, setCheckedExercises] = useState<Set<string>>(new Set());

  const toggleExercise = useCallback((key: string) => {
    setCheckedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">4-Day Split Routine</h2>
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
          Classic bodybuilding split consolidated from a 5-day program. Each session targets specific muscle groups
          with compound movements first, followed by isolation work. Designed for progressive overload.
        </p>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {splitRoutine.map((day, i) => (
          <button
            key={day.id}
            onClick={() => setActiveDay(i)}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeDay === i
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            Day {i + 1}
          </button>
        ))}
      </div>

      <WorkoutDayPanel
        day={splitRoutine[activeDay]}
        checkedExercises={checkedExercises}
        onToggleExercise={toggleExercise}
      />
    </div>
  );
}

function PushPullPage() {
  const [activeDay, setActiveDay] = useState(0);
  const [checkedExercises, setCheckedExercises] = useState<Set<string>>(new Set());

  const toggleExercise = useCallback((key: string) => {
    setCheckedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Push/Pull 4-Day Routine</h2>
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
          Movement-pattern based split. Push days train chest, shoulders, and triceps.
          Pull days target back, biceps, and rear delts. Legs get their own day.
          Day 4 combines upper body for balanced volume.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {pushPullRoutine.map((day, i) => (
          <button
            key={day.id}
            onClick={() => setActiveDay(i)}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeDay === i
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            Day {i + 1}
          </button>
        ))}
      </div>

      <WorkoutDayPanel
        day={pushPullRoutine[activeDay]}
        checkedExercises={checkedExercises}
        onToggleExercise={toggleExercise}
      />
    </div>
  );
}

/* ================================================================
   MAIN APP
   ================================================================ */

export default function WorkoutApp() {
  const [view, setView] = useState<View>('home');

  const navigate = useCallback((v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderView = () => {
    switch (view) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'split':
        return <SplitPage />;
      case 'pushpull':
        return <PushPullPage />;
      case 'pre-workout':
        return <PreWorkoutOverview />;
      case 'post-workout':
        return <PostWorkoutOverview />;
      case 'full-workout-1':
        return <FullWorkoutPanel workout={fullWorkout1} />;
      case 'full-workout-2':
        return <FullWorkoutPanel workout={fullWorkout2} />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <IconDumbbell className="w-5 h-5 text-brand-400" />
            <span className="font-bold text-lg text-zinc-100 group-hover:text-brand-300 transition-colors">
              IronForge
            </span>
          </button>

          {view !== 'home' && (
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <IconArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </button>
          )}

          {view === 'home' && (
            <nav className="hidden md:flex items-center gap-1">
              {(['split', 'pushpull', 'pre-workout', 'post-workout'] as View[]).map((v) => {
                const labels: Record<string, string> = {
                  split: 'Split',
                  pushpull: 'Push/Pull',
                  'pre-workout': 'Pre-WO',
                  'post-workout': 'Post-WO',
                };
                return (
                  <button
                    key={v}
                    onClick={() => navigate(v)}
                    className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-lg transition-all cursor-pointer"
                  >
                    {labels[v]}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {renderView()}
      </main>

      {/* Rest Timer — visible on workout pages */}
      {view !== 'home' && <RestTimer />}

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-zinc-600">
            IronForge — Built for strength &amp; muscle. Consistency is the ultimate superpower.
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <button onClick={() => navigate('split')} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">Split</button>
            <button onClick={() => navigate('pushpull')} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">Push/Pull</button>
            <button onClick={() => navigate('full-workout-1')} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">Workout 1</button>
            <button onClick={() => navigate('full-workout-2')} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">Workout 2</button>
            <button onClick={() => navigate('pre-workout')} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">Pre-WO</button>
            <button onClick={() => navigate('post-workout')} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">Post-WO</button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      {view === 'home' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/60 safe-area-bottom">
          <div className="grid grid-cols-4 gap-0">
            {([
              { v: 'split' as View, label: 'Split', icon: <IconDumbbell className="w-5 h-5" /> },
              { v: 'pushpull' as View, label: 'Push/Pull', icon: <IconSwap className="w-5 h-5" /> },
              { v: 'pre-workout' as View, label: 'Pre-WO', icon: <IconFire className="w-5 h-5" /> },
              { v: 'post-workout' as View, label: 'Post-WO', icon: <IconSnow className="w-5 h-5" /> },
            ]).map((item) => (
              <button
                key={item.v}
                onClick={() => navigate(item.v)}
                className="flex flex-col items-center gap-1 py-3 text-zinc-400 hover:text-brand-300 transition-colors cursor-pointer"
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
