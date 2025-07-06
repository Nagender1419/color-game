import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { useLocation } from "wouter";
import type { Game } from "@shared/schema";

interface GameHistoryProps {
  games: Game[];
}

export default function GameHistory({ games }: GameHistoryProps) {
  const [, setLocation] = useLocation();

  const getColorClass = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-500";
      case "green":
        return "bg-green-500";
      case "blue":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTime = (date: Date | string | null) => {
    if (!date) return "Unknown";
    const gameDate = new Date(date);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - gameDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else {
      return `${Math.floor(diffInMinutes / 60)} hr ago`;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Games</h3>
        
        <div className="space-y-3">
          {games.length > 0 ? (
            games.slice(0, 3).map((game) => (
              <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${getColorClass(game.selectedColor)}`}></div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{game.selectedColor}</p>
                    <p className="text-sm text-gray-600">Game #{game.gameNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    game.isWin ? "text-game-secondary" : "text-game-danger"
                  }`}>
                    {game.isWin ? "+" : "-"}₹{game.isWin ? game.winAmount : game.betAmount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTime(game.resolvedAt || game.createdAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <History className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No games yet</p>
            </div>
          )}
        </div>
        
        {games.length > 3 && (
          <Button
            onClick={() => setLocation("/history")}
            variant="ghost"
            className="w-full mt-4 text-game-primary hover:bg-gray-50"
          >
            View All History
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
