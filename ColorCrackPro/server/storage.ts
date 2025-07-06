import { users, games, transactions, type User, type InsertUser, type Game, type InsertGame, type Transaction, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserWalletBalance(userId: number, balance: string): Promise<void>;

  // Game operations
  createGame(game: InsertGame & { gameNumber: string }): Promise<Game>;
  getGame(id: number): Promise<Game | undefined>;
  getGamesByUserId(userId: number, limit?: number): Promise<Game[]>;
  updateGameResult(id: number, winningColor: string, winAmount: string, isWin: boolean): Promise<void>;
  getCurrentGameNumber(): Promise<string>;

  // Transaction operations
  createTransaction(transaction: InsertTransaction & { transactionId?: string }): Promise<Transaction>;
  getTransactionsByUserId(userId: number, limit?: number): Promise<Transaction[]>;
  updateTransactionStatus(id: number, status: string): Promise<void>;

  // Statistics
  getUserStats(userId: number): Promise<{
    totalGames: number;
    totalWins: number;
    totalWinnings: string;
    winRate: number;
    bestWin: string;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private transactions: Map<number, Transaction>;
  private currentUserId: number;
  private currentGameId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentGameId = 1;
    this.currentTransactionId = 1;

    // Create a default user for testing
    this.createUser({
      username: "testuser",
      email: "test@example.com",
      password: "password123"
    }).then(user => {
      this.updateUserWalletBalance(user.id, "1250.00");
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      walletBalance: "0.00",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserWalletBalance(userId: number, balance: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.walletBalance = balance;
      this.users.set(userId, user);
    }
  }

  async createGame(game: InsertGame & { gameNumber: string }): Promise<Game> {
    const id = this.currentGameId++;
    const newGame: Game = {
      ...game,
      id,
      winningColor: null,
      winAmount: "0.00",
      isWin: false,
      gameHash: this.generateGameHash(),
      createdAt: new Date(),
      resolvedAt: null,
    };
    this.games.set(id, newGame);
    return newGame;
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getGamesByUserId(userId: number, limit: number = 10): Promise<Game[]> {
    return Array.from(this.games.values())
      .filter(game => game.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async updateGameResult(id: number, winningColor: string, winAmount: string, isWin: boolean): Promise<void> {
    const game = this.games.get(id);
    if (game) {
      game.winningColor = winningColor;
      game.winAmount = winAmount;
      game.isWin = isWin;
      game.resolvedAt = new Date();
      this.games.set(id, game);
    }
  }

  async getCurrentGameNumber(): Promise<string> {
    return `G${Date.now()}`;
  }

  async createTransaction(transaction: InsertTransaction & { transactionId?: string }): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const newTransaction: Transaction = {
      ...transaction,
      id,
      status: "pending",
      transactionId: transaction.transactionId || `TXN${Date.now()}`,
      gameId: null,
      createdAt: new Date(),
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async getTransactionsByUserId(userId: number, limit: number = 10): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async updateTransactionStatus(id: number, status: string): Promise<void> {
    const transaction = this.transactions.get(id);
    if (transaction) {
      transaction.status = status;
      this.transactions.set(id, transaction);
    }
  }

  async getUserStats(userId: number): Promise<{
    totalGames: number;
    totalWins: number;
    totalWinnings: string;
    winRate: number;
    bestWin: string;
  }> {
    const userGames = Array.from(this.games.values()).filter(game => game.userId === userId);
    const totalGames = userGames.length;
    const totalWins = userGames.filter(game => game.isWin).length;
    const totalWinnings = userGames.reduce((sum, game) => sum + parseFloat(game.winAmount || "0"), 0);
    const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;
    const bestWin = userGames.reduce((max, game) => Math.max(max, parseFloat(game.winAmount || "0")), 0);

    return {
      totalGames,
      totalWins,
      totalWinnings: totalWinnings.toFixed(2),
      winRate,
      bestWin: bestWin.toFixed(2),
    };
  }

  private generateGameHash(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export const storage = new MemStorage();
