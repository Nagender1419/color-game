import { useQuery } from "@tanstack/react-query";
import GameHeader from "@/components/game/game-header";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { User as UserIcon, Shield, Trophy, Target, Clock } from "lucide-react";
import type { User } from "@shared/schema";

interface UserStats {
  totalGames: number;
  totalWins: number;
  totalWinnings: string;
  winRate: number;
  bestWin: string;
}

export default function Profile() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-game-bg">
      <GameHeader user={user} />
      
      <main className="container mx-auto px-4 py-6 space-y-6 pb-24">
        <div className="flex items-center space-x-3">
          <UserIcon className="w-6 h-6 text-game-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* User Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-game-primary rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.username}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {formatDate(user?.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-game-primary/10 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-game-primary" />
                  <span className="text-sm font-medium text-game-primary">Verified</span>
                </div>
                <p className="text-xs text-gray-600">Fair Play Certified</p>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
                <p className="text-xs text-gray-600">Player Status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gaming Statistics */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Gaming Statistics</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-6 h-6 text-game-primary" />
                </div>
                <div className="text-2xl font-bold text-game-primary">
                  {stats?.totalGames || 0}
                </div>
                <div className="text-sm text-gray-600">Total Games</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-6 h-6 text-game-secondary" />
                </div>
                <div className="text-2xl font-bold text-game-secondary">
                  {stats?.totalWins || 0}
                </div>
                <div className="text-sm text-gray-600">Total Wins</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-game-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">%</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Win Rate</p>
                    <p className="text-sm text-gray-600">Success percentage</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-game-accent">
                    {stats?.winRate || 0}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-game-secondary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">₹</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Total Winnings</p>
                    <p className="text-sm text-gray-600">All-time earnings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-game-secondary">
                    ₹{stats?.totalWinnings || "0.00"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-game-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🏆</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Best Win</p>
                    <p className="text-sm text-gray-600">Highest single win</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-game-primary">
                    ₹{stats?.bestWin || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Security</span>
                </div>
                <span className="text-sm text-gray-600">Change Password</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">History</span>
                </div>
                <span className="text-sm text-gray-600">View All</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}
