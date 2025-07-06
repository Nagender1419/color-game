import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface WinningResult {
  color: string;
  gameNumber: string;
  timestamp: Date;
}

export default function WinningHistory() {
  const [winningHistory, setWinningHistory] = useState<WinningResult[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const colors = [
    { name: "red", class: "bg-red-500", text: "text-red-500" },
    { name: "green", class: "bg-green-500", text: "text-green-500" },
    { name: "blue", class: "bg-blue-500", text: "text-blue-500" },
  ];

  const generateRandomResult = (): WinningResult => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return {
      color: randomColor.name,
      gameNumber: `G${Date.now().toString().slice(-6)}`,
      timestamp: new Date(),
    };
  };

  const addNewResult = () => {
    const newResult = generateRandomResult();
    setWinningHistory(prev => [newResult, ...prev.slice(0, 19)]); // Keep last 20 results
  };

  const refreshHistory = () => {
    setIsRefreshing(true);
    // Generate initial history
    const initialHistory = Array.from({ length: 10 }, () => {
      const result = generateRandomResult();
      // Make timestamps spread over last hour
      result.timestamp = new Date(Date.now() - Math.random() * 3600000);
      return result;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setWinningHistory(initialHistory);
    
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    // Initialize with some history
    refreshHistory();
    
    // Add new results every 45 seconds
    const interval = setInterval(addNewResult, 45000);
    
    return () => clearInterval(interval);
  }, []);

  const getColorConfig = (colorName: string) => {
    return colors.find(c => c.name === colorName) || colors[0];
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <History className="w-5 h-5 text-game-primary" />
            <span>Winning History</span>
          </CardTitle>
          <Button
            onClick={refreshHistory}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <RefreshCw className={cn("w-3 h-3 mr-1", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {winningHistory.map((result, index) => {
            const colorConfig = getColorConfig(result.color);
            return (
              <div
                key={`${result.gameNumber}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 border-white shadow-sm",
                    colorConfig.class
                  )}></div>
                  <div>
                    <p className="font-medium text-sm capitalize text-gray-900">
                      {result.color}
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.gameNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {formatTime(result.timestamp)}
                  </p>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-yellow-600">🏆</span>
                    <span className="text-xs font-medium text-green-600">2x</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {winningHistory.length === 0 && (
          <div className="text-center py-6">
            <History className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No history available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}