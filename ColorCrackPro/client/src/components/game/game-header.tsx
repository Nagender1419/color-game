import { Bell, User, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User as UserType } from "@shared/schema";

interface GameHeaderProps {
  user?: UserType;
}

export default function GameHeader({ user }: GameHeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-game-primary to-game-secondary rounded-full flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ColorWin</h1>
              <p className="text-xs text-gray-500">Fair Play Gaming</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-game-primary text-white px-4 py-2 rounded-lg">
              <div className="text-xs">Balance</div>
              <div className="font-bold">₹{user?.walletBalance || "0.00"}</div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Bell className="w-4 h-4" />
            </Button>
            
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
