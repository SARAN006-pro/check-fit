
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface ActivityData {
  id: string;
  type: 'Running' | 'Cycling' | 'Walking';
  distance: number; // in km
  pace: string; // min/km
  elevation: number;
  route: GPSPoint[];
  paceHistory: { time: string, pace: number }[];
}

export interface Recommendation {
  id: string;
  type: 'workout' | 'recovery' | 'nutrition';
  title: string;
  description: string;
  focusMuscle?: string;
  intensity?: 'Low' | 'Moderate' | 'High';
  duration?: string;
  icon: string;
}

export interface Goal {
  id: string;
  type: 'weight' | 'muscle' | 'stamina' | 'frequency';
  title: string;
  targetValue: number;
  currentValue: number;
  startValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'failed';
}

export interface Workout {
  id: string;
  type: 'Strength' | 'Cardio' | 'Yoga' | 'HIIT' | 'Other' | 'Running' | 'Cycling';
  title: string;
  duration: number; // in minutes
  calories: number;
  timestamp: string;
  metadata?: {
    sets?: string;
    reps?: string;
    weight?: string;
    bodyweight?: string;
    strengthScore?: string;
    distance?: string;
    avgPace?: string;
  };
}

export interface Notification {
  id: string;
  type: 'achievement' | 'social' | 'system' | 'workout';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  path: string; // New: target path for redirection
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number; // per 100g
  protein: number;
  carbs: number;
  fat: number;
  unit: string;
}

export interface LoggedFood extends FoodItem {
  logId: string;
  amount: number; // in grams or units
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface SquadMember {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  contributionPercent: number;
  isCurrentUser: boolean;
}

export interface SquadChallenge {
  id: string;
  name: string;
  objective: string;
  currentValue: number;
  targetValue: number;
  daysRemaining: number;
  members: SquadMember[];
}

export interface PlannerTask {
  id: string;
  title: string;
  sets: number;
  reps: string;
  completed: boolean;
  category: string;
  scheduledTime?: string;
}

export interface DailyPlan {
  date: string;
  tasks: PlannerTask[];
  isRestDay: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'strength' | 'consistency' | 'cardio' | 'special';
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export interface AchievementStats {
  currentStreak: number;
  bestStreak: number;
  totalPoints: number;
  rank: string;
  nextRank: string;
  rankProgress: number;
}

export interface DailyStats {
  burned: number;
  goal: number;
  steps: number;
  water: number;
}

export interface PersonalRecord {
  id: string;
  exercise: string;
  value: number;
  unit: string;
  date: string;
  previousValue?: number;
  icon: string;
}

export interface VolumeData {
  period: string;
  volume: number;
  intensity: number;
  recovery: number;
}

export interface WorkloadMetrics {
  currentLoad: number;
  optimalRange: [number, number];
  recoveryScore: number;
  status: 'Peak' | 'Productive' | 'Overtraining' | 'Recovery';
}

export interface BodyMeasurements {
  weight: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  legs?: number;
  timestamp: string;
}

export interface ProgressPhoto {
  id: string;
  url: string;
  type: 'front' | 'side' | 'back';
  timestamp: string;
}

export interface TimerSettings {
  workTime: number;
  restTime: number;
  rounds: number;
  mode: 'HIIT' | 'REST' | 'STOPWATCH';
}

export enum AuthView {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP'
}
