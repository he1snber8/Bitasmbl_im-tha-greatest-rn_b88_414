import React from "react";

export default function router({ items }: { items: string[] }) {
  return (
    <div>
      <ul className="p-2 flex flex-col list-disc space-y-2 text-lg">
        {items.map((item) => {
          return <li key={item}>{item} yoo bruh, point</li>;
        })}
      </ul>
    </div>
  );
}