export default function router({ items }: { items: string[] }) {
  return (
    <div>
      <ul className="p-2 flex flex-col list-disc space-y-2 text-lg">
        {items.map((item) => {
          return (
            <li key={item}>
              {item} yoo bruh, point, on, feracon negga, stfu, ma negga
            </li>
          );
        })}
      </ul>
    </div>
  );
}