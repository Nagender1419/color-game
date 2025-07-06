import { useQuery } from "@tanstack/react-query";
import GameHeader from "@/components/game/game-header";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { History as HistoryIcon } from "lucide-react";
import type { User, Game } from "@shared/schema";

export default function History() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/games/history"],
  });

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
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="min-h-screen bg-game-bg">
      <GameHeader user={user} />
      
      <main className="container mx-auto px-4 py-6 space-y-6 pb-24">
        <div className="flex items-center space-x-3">
          <HistoryIcon className="w-6 h-6 text-game-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Game History</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {games && games.length > 0 ? (
                games.map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full ${getColorClass(game.selectedColor)}`}></div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{game.selectedColor}</p>
                        <p className="text-sm text-gray-600">Game #{game.gameNumber}</p>
                        {game.winningColor && (
                          <p className="text-xs text-gray-500">
                            Winner: <span className="capitalize">{game.winningColor}</span>
                          </p>
                        )}
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
                <div className="text-center py-8">
                  <HistoryIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Games Yet</h3>
                  <p className="text-gray-600">Start playing to see your game history here!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}
