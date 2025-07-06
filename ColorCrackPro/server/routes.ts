import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (for demo purposes, we'll use user ID 1)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Get user statistics
  app.get("/api/user/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(1);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  // Create a new game
  app.post("/api/games", async (req, res) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const gameNumber = await storage.getCurrentGameNumber();
      
      // Check if user has sufficient balance
      const user = await storage.getUser(gameData.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const betAmount = parseFloat(gameData.betAmount);
      const walletBalance = parseFloat(user.walletBalance || "0");
      
      if (walletBalance < betAmount) {
        return res.status(400).json({ error: "Insufficient wallet balance" });
      }
      
      // Create the game
      const game = await storage.createGame({
        ...gameData,
        gameNumber,
      });
      
      // Deduct bet amount from wallet
      const newBalance = (walletBalance - betAmount).toFixed(2);
      await storage.updateUserWalletBalance(gameData.userId, newBalance);
      
      // Create bet transaction
      await storage.createTransaction({
        userId: gameData.userId,
        type: "bet",
        amount: gameData.betAmount,
        paymentMethod: null,
      });
      
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: "Invalid game data" });
    }
  });

  // Resolve a game (simulate game result)
  app.post("/api/games/:id/resolve", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const game = await storage.getGame(gameId);
      
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      
      if (game.winningColor) {
        return res.status(400).json({ error: "Game already resolved" });
      }
      
      // Generate random winning color (fair play algorithm)
      const colors = ["red", "green", "blue"];
      const winningColor = colors[Math.floor(Math.random() * colors.length)];
      
      const betAmount = parseFloat(game.betAmount);
      const isWin = game.selectedColor === winningColor;
      const winAmount = isWin ? betAmount * 2 : 0;
      
      // Update game result
      await storage.updateGameResult(gameId, winningColor, winAmount.toFixed(2), isWin);
      
      // If user won, add winnings to wallet
      if (isWin && game.userId) {
        const user = await storage.getUser(game.userId);
        if (user) {
          const currentBalance = parseFloat(user.walletBalance || "0");
          const newBalance = (currentBalance + winAmount).toFixed(2);
          await storage.updateUserWalletBalance(game.userId, newBalance);
          
          // Create win transaction
          await storage.createTransaction({
            userId: game.userId,
            type: "win",
            amount: winAmount.toFixed(2),
            paymentMethod: null,
          });
        }
      }
      
      const updatedGame = await storage.getGame(gameId);
      res.json(updatedGame);
    } catch (error) {
      res.status(500).json({ error: "Failed to resolve game" });
    }
  });

  // Get user's game history
  app.get("/api/games/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const games = await storage.getGamesByUserId(1, limit);
      res.json(games);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game history" });
    }
  });

  // Create deposit transaction
  app.post("/api/transactions/deposit", async (req, res) => {
    try {
      const schema = insertTransactionSchema.extend({
        amount: z.string().refine(val => parseFloat(val) >= 100, {
          message: "Minimum deposit amount is ₹100"
        })
      });
      
      const transactionData = schema.parse(req.body);
      
      // Create transaction
      const transaction = await storage.createTransaction({
        ...transactionData,
        type: "deposit",
      });
      
      // For demo purposes, immediately mark as completed and add to wallet
      await storage.updateTransactionStatus(transaction.id, "completed");
      
      const user = await storage.getUser(transactionData.userId);
      if (user) {
        const currentBalance = parseFloat(user.walletBalance || "0");
        const depositAmount = parseFloat(transactionData.amount);
        const newBalance = (currentBalance + depositAmount).toFixed(2);
        await storage.updateUserWalletBalance(transactionData.userId, newBalance);
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid deposit data" });
    }
  });

  // Create withdrawal transaction
  app.post("/api/transactions/withdraw", async (req, res) => {
    try {
      const schema = insertTransactionSchema.extend({
        amount: z.string().refine(val => parseFloat(val) >= 250, {
          message: "Minimum withdrawal amount is ₹250"
        })
      });
      
      const transactionData = schema.parse(req.body);
      
      // Check if user has sufficient balance
      const user = await storage.getUser(transactionData.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const withdrawAmount = parseFloat(transactionData.amount);
      const walletBalance = parseFloat(user.walletBalance || "0");
      
      if (walletBalance < withdrawAmount) {
        return res.status(400).json({ error: "Insufficient wallet balance" });
      }
      
      // Create transaction
      const transaction = await storage.createTransaction({
        ...transactionData,
        type: "withdraw",
      });
      
      // Deduct amount from wallet
      const newBalance = (walletBalance - withdrawAmount).toFixed(2);
      await storage.updateUserWalletBalance(transactionData.userId, newBalance);
      
      // For demo purposes, mark as completed
      await storage.updateTransactionStatus(transaction.id, "completed");
      
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid withdrawal data" });
    }
  });

  // Get user's transaction history
  app.get("/api/transactions/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await storage.getTransactionsByUserId(1, limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
