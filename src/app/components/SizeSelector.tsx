interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelectSize }: SizeSelectorProps) {
  return (
    <div className="flex gap-3">
      {sizes.map((size) => {
        const selected = selectedSize === size;
        return (
          <button
            key={size}
            type="button"
            onClick={() => onSelectSize(size)}
            className={[
              'flex h-10 w-10 cursor-pointer items-center justify-center border text-[13px] tracking-[2px] transition-colors duration-150',
              selected
                ? 'border-[#2C2420] bg-[#2C2420] text-white'
                : 'border-[#C4B5A0] text-[#6B6560] hover:border-[#2C2420] hover:text-[#1A1816]',
            ].join(' ')}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
