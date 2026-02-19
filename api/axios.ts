
import axios from 'axios';
import { 
  Workout, 
  FoodItem, 
  LoggedFood, 
  Badge, 
  AchievementStats, 
  WorkloadMetrics, 
  SquadChallenge, 
  PersonalRecord, 
  VolumeData, 
  BodyMeasurements, 
  ProgressPhoto, 
  ActivityData, 
  Recommendation, 
  Notification,
  Goal,
  DailyPlan,
  DailyStats
} from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zenfit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INITIAL MOCK DATA DEFINITION
const DEFAULT_DATA = {
  goals: [
    { id: 'g1', type: 'weight', title: 'Target Mass Reduction', startValue: 82.5, currentValue: 78.5, targetValue: 75.0, unit: 'kg', deadline: '2024-08-01', status: 'active' },
    { id: 'g2', type: 'muscle', title: 'Hypertrophy Phase', startValue: 32, currentValue: 34, targetValue: 38, unit: 'kg LBM', deadline: '2024-12-31', status: 'active' },
    { id: 'g3', type: 'frequency', title: 'Consistency Protocol', startValue: 0, currentValue: 4, targetValue: 5, unit: 'Sessions/Wk', deadline: '2024-05-20', status: 'active' }
  ] as Goal[],
  smartPlans: {
    '2024-05-14': { 
      date: '2024-05-14', 
      isRestDay: false, 
      tasks: [
        { id: 't1', title: 'Upper Body Hypertrophy', sets: 4, reps: '8-12', completed: false, category: 'Strength', scheduledTime: '08:00' },
        { id: 't2', title: 'Protein Pulse (30g)', sets: 1, reps: '1 unit', completed: true, category: 'Nutrition', scheduledTime: '09:30' }
      ]
    } as DailyPlan
  },
  dashboard: {
    burned: 1842,
    burnedGoal: 2400,
    intake: 1250,
    goal: 2400,
    steps: 8432,
    heartPoints: 48,
    moveMin: 52,
    activeMinutes: 52,
    activeMinutesGoal: 60,
    workouts: 1,
    workoutsGoal: 1,
    distance: 6.4,
    streak: 14,
    streakStatus: 'warning', // warning, critical, stable
    streakRecord: 21,
    nextMilestone: 15,
    strengthScore: 84,
    workoutsCount: 4,
    weeklyGoal: 150
  },
  weeklyReport: {
    period: 'May 06 - May 12, 2024',
    consistencyScore: 94,
    summaryMetrics: [
      { label: 'Total Energy Burned', value: '14,250', unit: 'kcal', delta: '+12%', isPositive: true },
      { label: 'Total Volume Moved', value: '82.4', unit: 'tons', delta: '+5%', isPositive: true },
      { label: 'Active Duration', value: '520', unit: 'mins', delta: '-2%', isPositive: false },
      { label: 'Avg Heart Rate', value: '72', unit: 'bpm', delta: '-4%', isPositive: true },
    ],
    caloricFlux: [
      { day: 'Mon', intake: 2400, burned: 1800 },
      { day: 'Tue', intake: 2200, burned: 2100 },
      { day: 'Wed', intake: 2500, burned: 1600 },
      { day: 'Thu', intake: 2100, burned: 2400 },
      { day: 'Fri', intake: 2300, burned: 1950 },
      { day: 'Sat', intake: 2800, burned: 2600 },
      { day: 'Sun', intake: 2200, burned: 2200 },
    ],
    highlights: [
      { id: 'h1', title: 'Strength Ceiling Broken', description: 'Reached a new 1RM on Back Squat (142.5kg).', type: 'strength' },
      { id: 'h2', title: 'Elite Recovery Week', description: 'Deep sleep averaged 2.4h per night, up 15%.', type: 'recovery' },
      { id: 'h3', title: 'Volume Milestone', description: 'Highest recorded weekly tonnage in the last 6 months.', type: 'volume' },
    ],
    achievements: [
      { id: 'a1', title: 'Force Titan', icon: '🏋️', date: 'May 09' },
      { id: 'a2', title: 'Sprint Master', icon: '🏃', date: 'May 11' },
    ]
  },
  notifications: [
    { id: 'n1', type: 'achievement', title: 'New Rank: Zen Master', message: 'You have ascended to the 14-day elite consistency tier.', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false, priority: 'high', path: '/achievements' },
    { id: 'n2', type: 'social', title: 'Challenge Update', message: 'Sarah Chen just contributed 4,500kg to the Global Force challenge.', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), read: false, priority: 'medium', path: '/challenges' },
  ] as Notification[],
  recommendations: [
    { 
      id: 'r1', 
      type: 'workout', 
      title: 'Posterior Power', 
      description: 'Focus on explosive hip extension based on your low load volume this week.', 
      focusMuscle: 'Glutes & Hamstrings',
      intensity: 'High',
      duration: '45m',
      icon: 'zap'
    }
  ] as Recommendation[],
  foods: [
    { id: 'f1', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: 'g' },
    { id: 'f2', name: 'White Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, unit: 'g' },
  ] as FoodItem[],
  nutritionLog: [
    { logId: 'l1', id: 'f1', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: 'g', amount: 200, timestamp: new Date().toISOString() },
  ] as LoggedFood[],
  workouts: [
    { id: '1', title: 'Morning Power', type: 'Strength', duration: 45, calories: 350, timestamp: new Date().toISOString() },
  ] as Workout[],
  profile: {
    name: 'Alex Johnson',
    email: 'alex.johnson@zenfit.pro',
    tier: 'Elite Performance',
    weight: 78.5,
    streak: 14,
    level: 12,
    xp: 4250,
    xpToNextLevel: 5000,
    macroGoals: { protein: 180, carbs: 250, fat: 70 },
    preferences: {
      units: 'metric',
      workoutReminders: true,
      achievementAlerts: true,
      marketingEmails: false
    }
  },
  activity: {
    id: 'a1',
    type: 'Running',
    distance: 5.42,
    pace: '5:12',
    elevation: 42,
    route: [],
    paceHistory: [
      { time: '0', pace: 0 },
      { time: '1km', pace: 5.2 },
    ]
  } as ActivityData,
  achievements: {
    stats: {
      currentStreak: 14,
      bestStreak: 21,
      totalPoints: 4250,
      rank: 'Zen Master',
      nextRank: 'Titan',
      rankProgress: 75,
      level: 12,
      totalXP: 14250,
    } as AchievementStats,
    badges: [
      { id: 'b1', title: 'Force Titan', description: 'Log a 100kg+ Strength protocol', icon: '🏋️', category: 'strength', unlocked: true, rarity: 'rare', dateUnlocked: '2024-05-09' },
      { id: 'b2', title: 'Early Grinder', description: 'Complete 5 sessions before 07:00 AM', icon: '🌅', category: 'consistency', unlocked: true, rarity: 'common', dateUnlocked: '2024-05-11' },
      { id: 'b3', title: 'Caloric Void', description: 'Burn 10,000 KCAL in one week', icon: '🌌', category: 'cardio', unlocked: false, rarity: 'elite', target: 10000, progress: 4250 },
      { id: 'b4', title: 'Consistency King', description: 'Maintain 30 day protocol streak', icon: '👑', category: 'consistency', unlocked: false, rarity: 'mythic', target: 30, progress: 14 },
    ] as Badge[]
  },
  analytics: {
    prs: [
      { id: 'pr1', exercise: 'Back Squat', value: 142.5, unit: 'kg', date: '2024-03-20', previousValue: 135, icon: '🏋️' },
    ] as PersonalRecord[],
    volumeTrend: [
      { period: 'May', volume: 16200, intensity: 84, recovery: 90 },
    ] as VolumeData[],
    strengthCurve: {
      'Back Squat': [
        { date: 'Mar 15', actual: 142.5, projected: 145 },
      ],
    },
    activityHeatmap: Array.from({ length: 91 }, (_, i) => ({
      date: new Date(Date.now() - (90 - i) * 86400000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 5),
      kcal: Math.floor(Math.random() * 800)
    })),
    workload: { 
      currentLoad: 82, 
      optimalRange: [65, 85], 
      recoveryScore: 92, 
      status: 'Peak' 
    } as WorkloadMetrics,
    muscleDistribution: [
      { subject: 'Chest', A: 120, B: 110, fullMark: 150 },
    ],
    recoveryMetrics: [
      { name: 'Sleep Quality', score: 88, status: 'Optimal' },
    ]
  },
  squads: {
    activeChallenge: {
      id: 'sc1',
      name: 'Global Force Integration',
      objective: 'Accumulate 1,000,000kg of total moved volume across the squad.',
      currentValue: 642500,
      targetValue: 1000000,
      daysRemaining: 12,
      members: [
        { id: 'm1', name: 'Alex Johnson', avatar: 'https://picsum.photos/100/100?sig=1', points: 12450, rank: 1, contributionPercent: 32, isCurrentUser: true },
      ]
    } as SquadChallenge
  },
  bodyProgress: {
    measurements: [
      { weight: 78.5, bodyFat: 18, waist: 86, chest: 108, timestamp: '2024-03-15T08:00:00Z' },
    ] as BodyMeasurements[],
    photos: [] as ProgressPhoto[]
  }
};

// STORAGE UTILITY
const getStoredData = () => {
  const stored = localStorage.getItem('zenfit_db');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('zenfit_db', JSON.stringify(DEFAULT_DATA));
  return DEFAULT_DATA;
};

const saveStoredData = (data: any) => {
  localStorage.setItem('zenfit_db', JSON.stringify(data));
};

export const fitnessApi = {
  getDashboard: async () => {
    const db = getStoredData();
    return { data: db.dashboard, isDemo: true };
  },
  getProfile: async () => {
    const db = getStoredData();
    return { data: db.profile, isDemo: true };
  },
  getAchievements: async () => {
    const db = getStoredData();
    return { data: db.achievements, isDemo: true };
  },
  logWorkout: async (workout: any) => {
    const db = getStoredData();
    const xpEarned = (workout.calories || 100) + (workout.duration || 10) * 5;
    const newWorkout = { ...workout, id: Math.random().toString(36).substr(2, 9), metadata: { ...workout.metadata, xpEarned } };
    
    db.workouts.unshift(newWorkout);
    db.dashboard.burned += workout.calories || 0;
    db.dashboard.workouts += 1;
    db.profile.xp += xpEarned;
    
    // Level up logic
    if (db.profile.xp >= db.profile.xpToNextLevel) {
       db.profile.level += 1;
       db.profile.xpToNextLevel = Math.round(db.profile.xpToNextLevel * 1.2);
    }
    
    saveStoredData(db);
    return { data: newWorkout };
  },
  // ... other methods as defined in original file
  getGoals: async () => {
    const data = getStoredData();
    return { data: data.goals, isDemo: true };
  },
  updateGoal: async (id: string, updates: Partial<Goal>) => {
    const db = getStoredData();
    const idx = db.goals.findIndex((g: any) => g.id === id);
    if (idx > -1) {
      db.goals[idx] = { ...db.goals[idx], ...updates };
      saveStoredData(db);
    }
    return { success: true };
  },
  generateSmartPlan: async (date: string) => {
    const db = getStoredData();
    const newPlan: DailyPlan = {
      date,
      isRestDay: Math.random() > 0.8,
      tasks: [
        { id: Math.random().toString(36).substr(2, 9), title: 'Automated Load Protocol', sets: 5, reps: '5', completed: false, category: 'Strength' },
      ]
    };
    db.smartPlans[date] = newPlan;
    saveStoredData(db);
    return { data: newPlan, isDemo: true };
  },
  getWeeklyReport: async () => {
    const db = getStoredData();
    return { data: db.weeklyReport, isDemo: true };
  },
  getRecommendations: async () => {
    const db = getStoredData();
    return { data: db.recommendations, isDemo: true };
  },
  getWorkouts: async () => {
    const db = getStoredData();
    return { data: db.workouts, isDemo: true };
  },
  getNotifications: async () => {
    const db = getStoredData();
    return { data: db.notifications, isDemo: true };
  },
  markNotificationRead: async (id: string) => {
    const db = getStoredData();
    const n = db.notifications.find((n: any) => n.id === id);
    if (n) n.read = true;
    saveStoredData(db);
    return { success: true };
  },
  markAllNotificationsRead: async () => {
    const db = getStoredData();
    db.notifications.forEach((n: any) => n.read = true);
    saveStoredData(db);
    return { success: true };
  },
  deleteWorkout: async (id: string) => {
    const db = getStoredData();
    const idx = db.workouts.findIndex((w: any) => w.id === id);
    if (idx > -1) {
      db.workouts.splice(idx, 1);
      saveStoredData(db);
    }
    return { success: true };
  },
  updateProfile: async (data: any) => {
    const db = getStoredData();
    db.profile = { ...db.profile, ...data };
    saveStoredData(db);
    return { data: db.profile, success: true };
  },
  updateSettings: async (data: any) => {
    const db = getStoredData();
    db.profile.preferences = { ...db.profile.preferences, ...data };
    saveStoredData(db);
    return { data: db.profile.preferences, success: true };
  },
  getAnalytics: async () => {
    const db = getStoredData();
    return { data: db.analytics, isDemo: true };
  },
  getPlanner: async (date: string) => {
    const db = getStoredData();
    return { data: db.smartPlans[date] || { date, tasks: [], isRestDay: false }, isDemo: true };
  },
  toggleTask: async (taskId: string) => {
    const db = getStoredData();
    Object.keys(db.smartPlans).forEach(date => {
      const task = db.smartPlans[date].tasks.find((t: any) => t.id === taskId);
      if (task) task.completed = !task.completed;
    });
    saveStoredData(db);
    return { success: true };
  },
  getSquadChallenge: async () => {
    const db = getStoredData();
    return { data: db.squads.activeChallenge, isDemo: true };
  },
  getFoods: async () => {
    const db = getStoredData();
    return { data: db.foods, isDemo: true };
  },
  getNutritionLog: async () => {
    const db = getStoredData();
    return { data: db.nutritionLog, isDemo: true };
  },
  logFood: async (food: any) => { 
    const db = getStoredData();
    const newLog = { ...food, logId: Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString() };
    db.nutritionLog.unshift(newLog);
    const intakeAdd = Math.round(food.calories * (food.amount / 100));
    db.dashboard.intake += intakeAdd;
    saveStoredData(db);
    return { data: newLog }; 
  },
  deleteFoodLog: async (logId: string) => {
    const db = getStoredData();
    const idx = db.nutritionLog.findIndex((l: any) => l.logId === logId);
    if (idx > -1) {
      db.nutritionLog.splice(idx, 1);
      saveStoredData(db);
    }
    return { success: true };
  },
  getBodyMeasurements: async () => {
    const db = getStoredData();
    return { data: db.bodyProgress.measurements, isDemo: true };
  },
  getProgressPhotos: async () => {
    const db = getStoredData();
    return { data: db.bodyProgress.photos, isDemo: true };
  },
  logMeasurements: async (entry: BodyMeasurements) => {
    const db = getStoredData();
    db.bodyProgress.measurements.unshift(entry);
    db.profile.weight = entry.weight;
    saveStoredData(db);
    return { data: entry, isDemo: true };
  },
  uploadPhoto: async (data: Partial<ProgressPhoto>) => {
    const db = getStoredData();
    const newPhoto = { ...data, id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString() } as ProgressPhoto;
    db.bodyProgress.photos.push(newPhoto);
    saveStoredData(db);
    return { data: newPhoto, isDemo: true };
  },
  getActivity: async () => {
    const db = getStoredData();
    return { data: db.activity, isDemo: true };
  },
  // Fix: Added scanFood method to fitnessApi to resolve property access errors in App.tsx and Food.tsx
  scanFood: async (base64: string) => {
    // Simulated AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      data: {
        name: "Macro-Optimized Fuel",
        calories: 450,
        protein: 35,
        carbs: 40,
        fat: 15
      }
    };
  }
};

// Fix: Exported authApi to resolve missing member error in Auth.tsx
export const authApi = {
  login: async (credentials: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: { token: 'mock_token_' + Date.now() } };
  },
  signup: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: { token: 'mock_token_' + Date.now() } };
  },
  googleLogin: () => {
    const token = 'mock_google_token_' + Date.now();
    localStorage.setItem('zenfit_token', token);
    window.location.reload();
  }
};
