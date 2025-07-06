import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface WinnerAnnouncementProps {
  winningColor: string | null;
  gameNumber: string;
  isWin: boolean;
  winAmount: string;
  open: boolean;
  onClose: () => void;
}

export default function WinnerAnnouncement({
  winningColor,
  gameNumber,
  isWin,
  winAmount,
  open,
  onClose
}: WinnerAnnouncementProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open && isWin) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [open, isWin]);

  const getColorConfig = (color: string) => {
    switch (color) {
      case "red":
        return { bg: "bg-red-500", text: "text-red-500", ring: "ring-red-500" };
      case "green":
        return { bg: "bg-green-500", text: "text-green-500", ring: "ring-green-500" };
      case "blue":
        return { bg: "bg-blue-500", text: "text-blue-500", ring: "ring-blue-500" };
      default:
        return { bg: "bg-gray-500", text: "text-gray-500", ring: "ring-gray-500" };
    }
  };

  if (!winningColor) return null;

  const colorConfig = getColorConfig(winningColor);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-4">
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="confetti">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      backgroundColor: ['#ef4444', '#22c55e', '#3b82f6'][Math.floor(Math.random() * 3)],
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="relative">
            <div className={cn(
              "w-24 h-24 rounded-full mx-auto flex items-center justify-center shadow-2xl",
              colorConfig.bg,
              `ring-8 ring-offset-4 ${colorConfig.ring}`
            )}>
              <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
            </div>
            
            {isWin && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                {isWin ? "YOU WON!" : "Better Luck Next Time!"}
              </h2>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            
            <p className="text-lg font-semibold capitalize">
              Winning Color: <span className={colorConfig.text}>{winningColor}</span>
            </p>
            
            <p className="text-sm text-gray-600">
              Game #{gameNumber}
            </p>
            
            {isWin && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">
                  🎉 You won ₹{winAmount}!
                </p>
                <p className="text-sm text-green-600">
                  Winnings added to your wallet
                </p>
              </div>
            )}
          </div>

          <Button
            onClick={onClose}
            className="w-full mt-6 bg-gradient-to-r from-game-primary to-game-secondary"
          >
            Continue Playing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}