import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import GameHeader from "@/components/game/game-header";
import BottomNavigation from "@/components/ui/bottom-navigation";
import DepositModal from "@/components/modals/deposit-modal";
import WithdrawModal from "@/components/modals/withdraw-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet as WalletIcon, Plus, Download } from "lucide-react";
import type { User, Transaction } from "@shared/schema";

export default function Wallet() {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions/history"],
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <Plus className="w-4 h-4 text-green-600" />;
      case "withdraw":
        return <Download className="w-4 h-4 text-blue-600" />;
      case "win":
        return <span className="text-green-600 text-sm">🎉</span>;
      case "bet":
        return <span className="text-red-600 text-sm">🎲</span>;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
      case "win":
        return "text-game-secondary";
      case "withdraw":
      case "bet":
        return "text-game-danger";
      default:
        return "text-gray-700";
    }
  };

  const formatTime = (date: Date | string | null) => {
    if (!date) return "Unknown";
    const transactionDate = new Date(date);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60));
    
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
          <WalletIcon className="w-6 h-6 text-game-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        </div>

        {/* Wallet Balance */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Available Balance</p>
              <p className="text-4xl font-bold text-game-primary mb-6">
                ₹{user?.walletBalance || "0.00"}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowDepositModal(true)}
                  className="bg-game-secondary hover:bg-game-secondary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Money
                </Button>
                <Button
                  onClick={() => setShowWithdrawModal(true)}
                  variant="outline"
                  className="border-game-primary text-game-primary hover:bg-game-primary hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
            
            <div className="space-y-3">
              {transactions && transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{transaction.type}</p>
                        <p className="text-sm text-gray-600">
                          {transaction.transactionId}
                        </p>
                        <p className="text-xs text-gray-500">
                          Status: <span className="capitalize">{transaction.status}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === "deposit" || transaction.type === "win" ? "+" : "-"}₹{transaction.amount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <WalletIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
                  <p className="text-gray-600">Your transaction history will appear here!</p>
                </div>
              )}
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
          queryClient.invalidateQueries({ queryKey: ["/api/transactions/history"] });
        }}
      />
      
      <WithdrawModal
        open={showWithdrawModal}
        onOpenChange={setShowWithdrawModal}
        user={user}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["/api/user"] });
          queryClient.invalidateQueries({ queryKey: ["/api/transactions/history"] });
        }}
      />
    </div>
  );
}
