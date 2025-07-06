import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onSuccess?: () => void;
}

export default function WithdrawModal({ open, onOpenChange, user, onSuccess }: WithdrawModalProps) {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState("");

  const predefinedAmounts = [250, 500, 1000];

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      const amount = customAmount ? parseInt(customAmount) : selectedAmount;
      if (amount < 250) {
        throw new Error("Minimum withdrawal amount is ₹250");
      }
      
      const response = await apiRequest("POST", "/api/transactions/withdraw", {
        userId: 1,
        amount: amount.toString(),
        paymentMethod: "bank_transfer",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Successful!",
        description: "Money will be transferred to your bank account",
      });
      onOpenChange(false);
      setSelectedAmount(0);
      setCustomAmount("");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;
  const walletBalance = parseFloat(user?.walletBalance || "0");
  const canWithdraw = finalAmount >= 250 && finalAmount <= walletBalance;

  const handleAllAmount = () => {
    const balance = Math.floor(walletBalance);
    if (balance >= 250) {
      setSelectedAmount(balance);
      setCustomAmount("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Money</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Minimum withdrawal amount is ₹250
            </AlertDescription>
          </Alert>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Withdraw Amount</Label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className="text-sm"
                  disabled={amount > walletBalance}
                >
                  ₹{amount}
                </Button>
              ))}
              <Button
                onClick={handleAllAmount}
                variant={selectedAmount === Math.floor(walletBalance) ? "default" : "outline"}
                className="text-sm"
                disabled={walletBalance < 250}
              >
                All
              </Button>
            </div>
            <Input
              type="number"
              placeholder="Enter amount (min ₹250)"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(0);
              }}
              min="250"
              max={walletBalance}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Bank Account</Label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">ICICI Bank</p>
              <p className="text-sm text-gray-600">****1234</p>
              <Button variant="link" className="text-game-primary text-sm font-medium mt-1 p-0">
                Change Account
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span>Withdrawal Amount:</span>
              <span>₹{finalAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Processing Fee:</span>
              <span>₹0</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-medium">
              <span>You'll Receive:</span>
              <span>₹{finalAmount}</span>
            </div>
          </div>
          
          <Button
            onClick={() => withdrawMutation.mutate()}
            disabled={!canWithdraw || withdrawMutation.isPending}
            className="w-full bg-gradient-to-r from-game-primary to-game-secondary hover:shadow-lg transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            {withdrawMutation.isPending ? "Processing..." : "Withdraw Money"}
          </Button>
          
          {finalAmount > walletBalance && (
            <p className="text-sm text-red-600">
              Insufficient balance. Available: ₹{user?.walletBalance}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
