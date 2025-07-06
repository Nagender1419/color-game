import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface WinningResult {
  color: string;
  gameNumber: string;
  timestamp: Date;
}

export default function WinningDisplay() {
  const [currentWinner, setCurrentWinner] = useState<WinningResult | null>(null);
  const [previousWinners, setPreviousWinners] = useState<string[]>([]);

  const colors = [
    { name: "red", class: "bg-red-500 text-white", ring: "ring-red-500" },
    { name: "green", class: "bg-green-500 text-white", ring: "ring-green-500" },
    { name: "blue", class: "bg-blue-500 text-white", ring: "ring-blue-500" },
  ];

  const generateRandomWinner = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const gameNumber = `G${Date.now().toString().slice(-6)}`;
    
    const newWinner: WinningResult = {
      color: randomColor.name,
      gameNumber,
      timestamp: new Date(),
    };

    // Add current winner to previous winners
    if (currentWinner) {
      setPreviousWinners(prev => [currentWinner.color, ...prev.slice(0, 9)]);
    }

    setCurrentWinner(newWinner);
  };

  useEffect(() => {
    // Generate initial winner
    generateRandomWinner();

    // Generate new winner every 30 seconds
    const interval = setInterval(generateRandomWinner, 30000);

    return () => clearInterval(interval);
  }, []);

  const getColorConfig = (colorName: string) => {
    return colors.find(c => c.name === colorName) || colors[0];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!currentWinner) return null;

  const winnerConfig = getColorConfig(currentWinner.color);

  return (
    <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h3 className="font-bold text-gray-900">Latest Winner</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(currentWinner.timestamp)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-3">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-105",
            winnerConfig.class,
            `ring-4 ring-offset-2 ${winnerConfig.ring}`
          )}>
            <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-gray-900 capitalize">
              {currentWinner.color}
            </h4>
            <p className="text-sm text-gray-600">
              Game #{currentWinner.gameNumber}
            </p>
            <p className="text-xs text-yellow-600 font-medium">
              🎉 Winner! 2x Payout
            </p>
          </div>
        </div>

        {previousWinners.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Previous Results:</p>
            <div className="flex space-x-2">
              {previousWinners.map((color, index) => {
                const colorConfig = getColorConfig(color);
                return (
                  <div
                    key={index}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 border-white shadow-sm",
                      colorConfig.class
                    )}
                    title={`Previous: ${color}`}
                  ></div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}