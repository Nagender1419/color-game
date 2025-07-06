import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import GameHeader from "@/components/game/game-header";
import WinningDisplay from "@/components/game/winning-display";
import WinningHistory from "@/components/game/winning-history";
import ColorSelector from "@/components/game/color-selector";
import BetSelector from "@/components/game/bet-selector";
import GameTimer from "@/components/game/game-timer";
import QuickActions from "@/components/game/quick-actions";
import GameHistory from "@/components/game/game-history";
import WinnerAnnouncement from "@/components/game/winner-announcement";
import DepositModal from "@/components/modals/deposit-modal";
import WithdrawModal from "@/components/modals/withdraw-modal";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Palette, Dice6 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User, Game } from "@shared/schema";

interface UserStats {
  totalGames: number;
  totalWins: number;
  totalWinnings: string;
  winRate: number;
  bestWin: string;
}

export default function GamePage() {
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [lastGameResult, setLastGameResult] = useState<Game | null>(null);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
  });

  const { data: gameHistory } = useQuery<Game[]>({
    queryKey: ["/api/games/history"],
  });

  const placeBetMutation = useMutation({
    mutationFn: async () => {
      if (!selectedColor || !selectedAmount) {
        throw new Error("Please select a color and bet amount");
      }
      
      const response = await apiRequest("POST", "/api/games", {
        userId: 1,
        selectedColor,
        betAmount: selectedAmount.toString(),
      });
      return response.json();
    },
    onSuccess: (game: Game) => {
      setGameInProgress(true);
      toast({
        title: "Bet Placed!",
        description: `You bet ₹${selectedAmount} on ${selectedColor}`,
      });
      
      // Simulate game resolution after 3 seconds
      setTimeout(() => {
        resolveGameMutation.mutate(game.id);
      }, 3000);
      
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resolveGameMutation = useMutation({
    mutationFn: async (gameId: number) => {
      const response = await apiRequest("POST", `/api/games/${gameId}/resolve`, {});
      return response.json();
    },
    onSuccess: (game: Game) => {
      setGameInProgress(false);
      setSelectedColor("");
      setSelectedAmount(0);
      setLastGameResult(game);
      setShowWinnerModal(true);
      
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/games/history"] });
    },
  });

  const canPlaceBet = Boolean(selectedColor) && selectedAmount > 0 && !gameInProgress && !placeBetMutation.isPending;
  const potentialWin = selectedAmount * 2;

  return (
    <div className="min-h-screen bg-game-bg">
      <GameHeader user={user} />
      
      <main className="container mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Winning Display */}
        <WinningDisplay />
        
        {/* Fair Play Badge */}
        <Card className="border-green-100 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fair Play Certified</h3>
                <p className="text-sm text-gray-600">Provably fair algorithm • Transparent results</p>
              </div>
              <div className="ml-auto">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Verified
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Section */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <Palette className="w-8 h-8 text-game-primary mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Color Prediction Game</h2>
              </div>
              <p className="text-gray-600">Pick a color and win up to 2x your bet!</p>
            </div>

            <GameTimer />

            <ColorSelector
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
              disabled={gameInProgress}
            />

            <BetSelector
              selectedAmount={selectedAmount}
              onAmountSelect={setSelectedAmount}
              disabled={gameInProgress}
            />

            {/* Selected Bet Display */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selected:</p>
                  <p className="font-semibold capitalize">
                    {selectedColor || "No color selected"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Bet Amount:</p>
                  <p className="font-semibold">₹{selectedAmount}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Potential Win:</p>
                  <p className="font-semibold text-game-secondary">₹{potentialWin}</p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <QuickActions
          user={user}
          onDeposit={() => setShowDepositModal(true)}
          onWithdraw={() => setShowWithdrawModal(true)}
          onPlaceBet={() => placeBetMutation.mutate()}
          canPlaceBet={canPlaceBet}
          selectedColor={selectedColor}
          selectedAmount={selectedAmount}
          potentialWin={potentialWin}
        />

        {/* Winning History */}
        <WinningHistory />

        <GameHistory games={gameHistory || []} />

        {/* Statistics */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-game-primary">
                  {stats?.totalGames || 0}
                </div>
                <div className="text-sm text-gray-600">Total Games</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-game-secondary">
                  {stats?.winRate || 0}%
                </div>
                <div className="text-sm text-gray-600">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-game-accent">
                  ₹{stats?.totalWinnings || "0.00"}
                </div>
                <div className="text-sm text-gray-600">Total Winnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  ₹{stats?.bestWin || "0.00"}
                </div>
                <div className="text-sm text-gray-600">Best Win</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
      
      <DepositModal
        open={showDepositModal}
        onOpenChange={setShowDepositModal}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        }}
      />
      
      <WithdrawModal
        open={showWithdrawModal}
        onOpenChange={setShowWithdrawModal}
        user={user}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        }}
      />
      
      <WinnerAnnouncement
        winningColor={lastGameResult?.winningColor || null}
        gameNumber={lastGameResult?.gameNumber || ""}
        isWin={lastGameResult?.isWin || false}
        winAmount={lastGameResult?.winAmount || "0"}
        open={showWinnerModal}
        onClose={() => setShowWinnerModal(false)}
      />
    </div>
  );
}
