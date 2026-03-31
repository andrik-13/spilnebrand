import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface AccordionItem {
  title: string;
  content: string;
}

interface ProductAccordionProps {
  items: AccordionItem[];
}

export function ProductAccordion({ items }: ProductAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-t border-[#C4B5A0]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.title} className="border-b border-[#C4B5A0]">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="text-[14px] uppercase tracking-[1.5px] text-[#1A1816]">{item.title}</span>
              {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
            {isOpen && (
              <div className="pb-4 whitespace-pre-line text-[#6B6560]">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
