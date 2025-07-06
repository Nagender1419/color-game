export function generateGameHash(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function determineWinningColor(): string {
  const colors = ["red", "green", "blue"];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function calculateWinAmount(betAmount: number, isWin: boolean): number {
  return isWin ? betAmount * 2 : 0;
}

export function formatCurrency(amount: string | number): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return `₹${numAmount.toFixed(2)}`;
}

export function formatTimeAgo(date: Date | string | null): string {
  if (!date) return "Unknown";
  
  const targetDate = new Date(date);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hr ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  }
}
