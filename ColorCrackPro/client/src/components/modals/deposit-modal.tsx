import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Smartphone, CreditCard, Building, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function DepositModal({ open, onOpenChange, onSuccess }: DepositModalProps) {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const depositMutation = useMutation({
    mutationFn: async () => {
      const amount = customAmount ? parseInt(customAmount) : selectedAmount;
      if (amount < 100) {
        throw new Error("Minimum deposit amount is ₹100");
      }
      
      const response = await apiRequest("POST", "/api/transactions/deposit", {
        userId: 1,
        amount: amount.toString(),
        paymentMethod,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Deposit Successful!",
        description: "Money has been added to your wallet",
      });
      onOpenChange(false);
      setSelectedAmount(0);
      setCustomAmount("");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Deposit Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Money</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Select Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className="text-sm"
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Enter custom amount (min ₹100)"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(0);
              }}
              min="100"
              className="mt-2"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center cursor-pointer">
                  <Smartphone className="w-4 h-4 text-game-primary mr-2" />
                  UPI
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center cursor-pointer">
                  <CreditCard className="w-4 h-4 text-game-primary mr-2" />
                  Debit/Credit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="netbanking" id="netbanking" />
                <Label htmlFor="netbanking" className="flex items-center cursor-pointer">
                  <Building className="w-4 h-4 text-game-primary mr-2" />
                  Net Banking
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button
            onClick={() => depositMutation.mutate()}
            disabled={finalAmount < 100 || depositMutation.isPending}
            className="w-full bg-gradient-to-r from-game-primary to-game-secondary hover:shadow-lg transition-all duration-200"
          >
            <Lock className="w-4 h-4 mr-2" />
            {depositMutation.isPending ? "Processing..." : `Pay ₹${finalAmount}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
