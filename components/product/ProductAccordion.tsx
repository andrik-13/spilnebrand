interface ProductAccordionProps {
  items: Array<{ title: string; content: string }>;
}

export function ProductAccordion({ items }: ProductAccordionProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.title} className="border-b border-accent pb-3">
          <summary className="cursor-pointer list-none text-[13px] uppercase tracking-[2px] text-primary">
            {item.title}
          </summary>
          <p className="mt-3 whitespace-pre-line text-muted">{item.content}</p>
        </details>
      ))}
    </div>
  );
}
