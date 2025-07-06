import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  disabled?: boolean;
}

export default function ColorSelector({ selectedColor, onColorSelect, disabled }: ColorSelectorProps) {
  const colors = [
    { name: "red", class: "bg-red-500 hover:bg-red-600" },
    { name: "green", class: "bg-green-500 hover:bg-green-600" },
    { name: "blue", class: "bg-blue-500 hover:bg-blue-600" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {colors.map((color) => (
        <Button
          key={color.name}
          onClick={() => onColorSelect(color.name)}
          disabled={disabled}
          className={cn(
            "group relative text-white rounded-xl p-6 transition-all duration-200 transform hover:scale-105",
            color.class,
            selectedColor === color.name && "ring-4 ring-white ring-opacity-50"
          )}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h3 className="font-bold text-lg capitalize">{color.name}</h3>
            <p className="text-sm opacity-90">Win 2x</p>
          </div>
          <div className="absolute inset-0 bg-white bg-opacity-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </Button>
      ))}
    </div>
  );
}
