import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BetSelectorProps {
  selectedAmount: number;
  onAmountSelect: (amount: number) => void;
  disabled?: boolean;
}

export default function BetSelector({ selectedAmount, onAmountSelect, disabled }: BetSelectorProps) {
  const [customAmount, setCustomAmount] = useState("");

  const predefinedAmounts = [10, 50, 100, 250];

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const amount = parseInt(value);
    if (amount >= 10) {
      onAmountSelect(amount);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-900 mb-3">Select Bet Amount</h3>
      <div className="grid grid-cols-4 gap-2">
        {predefinedAmounts.map((amount) => (
          <Button
            key={amount}
            onClick={() => {
              onAmountSelect(amount);
              setCustomAmount("");
            }}
            disabled={disabled}
            variant={selectedAmount === amount ? "default" : "outline"}
            className={cn(
              "transition-colors",
              selectedAmount === amount && "bg-game-primary text-white"
            )}
          >
            ₹{amount}
          </Button>
        ))}
      </div>
      <div className="mt-3">
        <Input
          type="number"
          placeholder="Custom amount (min ₹10)"
          value={customAmount}
          onChange={(e) => handleCustomAmountChange(e.target.value)}
          disabled={disabled}
          min="10"
          max="1000"
          className="focus:ring-game-primary focus:border-game-primary"
        />
      </div>
    </div>
  );
}
