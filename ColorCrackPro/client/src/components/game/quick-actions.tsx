import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Download, Dice6, Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import type { User } from "@shared/schema";

interface QuickActionsProps {
  user?: User;
  onDeposit: () => void;
  onWithdraw: () => void;
  onPlaceBet: () => void;
  canPlaceBet: boolean;
  selectedColor: string;
  selectedAmount: number;
  potentialWin: number;
}

export default function QuickActions({
  user,
  onDeposit,
  onWithdraw,
  onPlaceBet,
  canPlaceBet,
  selectedColor,
  selectedAmount,
  potentialWin
}: QuickActionsProps) {
  const walletBalance = parseFloat(user?.walletBalance || "0");

  return (
    <div className="space-y-4">
      {/* Wallet Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Wallet Actions</h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Balance</p>
              <p className="font-bold text-lg text-blue-600">₹{user?.walletBalance || "0.00"}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onDeposit}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div className="font-semibold">Add Money</div>
                <div className="text-xs opacity-90">Min ₹100</div>
              </div>
            </Button>

            <Button
              onClick={onWithdraw}
              disabled={walletBalance < 250}
              variant="outline"
              className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div className="font-semibold">Withdraw</div>
                <div className="text-xs opacity-70">Min ₹250</div>
              </div>
            </Button>
          </div>
          
          {walletBalance < 250 && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Add more money to enable withdrawals
            </p>
          )}
        </CardContent>
      </Card>

      {/* Betting Action */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Dice6 className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Place Your Bet</h3>
          </div>
          
          {selectedColor && selectedAmount > 0 ? (
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-orange-200">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-600">Color</p>
                    <p className="font-semibold capitalize text-gray-900">{selectedColor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Bet Amount</p>
                    <p className="font-semibold text-gray-900">₹{selectedAmount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Potential Win</p>
                    <p className="font-semibold text-green-600">₹{potentialWin}</p>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={onPlaceBet}
                disabled={!canPlaceBet}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                size="lg"
              >
                <Dice6 className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-bold">PLACE BET</div>
                  <div className="text-xs opacity-90">Win 2x your bet!</div>
                </div>
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-2">Select a color and amount to bet</p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <ArrowUpCircle className="w-3 h-3" />
                  <span>Choose color above</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ArrowDownCircle className="w-3 h-3" />
                  <span>Set bet amount</span>
                </div>
              </div>
            </div>
          )}
          
          {selectedAmount > walletBalance && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-xs text-center">
                Insufficient balance. Add money to place this bet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}