/**
 * Mock API service for simulating backend calls
 */

// Types
interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
  xp: number;
  level: number;
  coins: number;
  joinDate: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xpReward: number;
  coinReward: number;
  icon: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xpReward: number;
  coinReward: number;
  dueDate?: string;
}

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data
const mockUser: User = {
  id: 'user-1',
  name: 'John Smith',
  email: 'john@example.com',
  businessName: 'Smith\'s Restaurant',
  xp: 1200,
  level: 2,
  coins: 450,
  joinDate: '2025-01-15',
};

// Mock achievements data
const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Step',
    description: 'Welcome to the app!',
    completed: true,
    xpReward: 100,
    coinReward: 50,
    icon: 'award',
  },
  {
    id: 'ach-2',
    title: 'Business Expert',
    description: 'Complete 5 business tasks',
    completed: false,
    xpReward: 300,
    coinReward: 150,
    icon: 'briefcase',
  },
  {
    id: 'ach-3',
    title: 'Social Network',
    description: 'Connect 3 social media accounts',
    completed: false,
    xpReward: 200,
    coinReward: 100,
    icon: 'share-alt',
  },
];

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Daily business check',
    description: 'Check daily sales and inventory',
    completed: false,
    xpReward: 50,
    coinReward: 25,
    dueDate: '2025-06-09',
  },
  {
    id: 'task-2',
    title: 'Social media post',
    description: 'Share daily social media content for your business',
    completed: false,
    xpReward: 30,
    coinReward: 15,
    dueDate: '2025-06-09',
  },
  {
    id: 'task-3',
    title: 'Customer feedback',
    description: 'Get feedback from at least 3 customers',
    completed: false,
    xpReward: 80,
    coinReward: 40,
  },
];

// API functions
export const api = {
  // User
  getUser: async (): Promise<User> => {
    await delay(800);
    return { ...mockUser };
  },
  
  updateUser: async (updates: Partial<User>): Promise<User> => {
    await delay(600);
    Object.assign(mockUser, updates);
    return { ...mockUser };
  },
  
  // Achievements
  getAchievements: async (): Promise<Achievement[]> => {
    await delay(700);
    return [...mockAchievements];
  },
  
  completeAchievement: async (id: string): Promise<Achievement> => {
    await delay(500);
    const achievement = mockAchievements.find(a => a.id === id);
    if (!achievement) {
      throw new Error(`Achievement with ID ${id} not found`);
    }
    
    achievement.completed = true;
    mockUser.xp += achievement.xpReward;
    mockUser.coins += achievement.coinReward;
    mockUser.level = Math.floor(mockUser.xp / 1000) + 1;
    
    return { ...achievement };
  },
  
  // Tasks
  getTasks: async (): Promise<Task[]> => {
    await delay(600);
    return [...mockTasks];
  },
  
  completeTask: async (id: string): Promise<Task> => {
    await delay(400);
    const task = mockTasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    task.completed = true;
    mockUser.xp += task.xpReward;
    mockUser.coins += task.coinReward;
    mockUser.level = Math.floor(mockUser.xp / 1000) + 1;
    
    return { ...task };
  },
  
  // Check for new rewards/daily bonuses
  checkDailyBonus: async (): Promise<{ coins: number; xp: number }> => {
    await delay(300);
    const bonus = { coins: 25, xp: 50 };
    mockUser.coins += bonus.coins;
    mockUser.xp += bonus.xp;
    mockUser.level = Math.floor(mockUser.xp / 1000) + 1;
    
    return bonus;
  },
};
