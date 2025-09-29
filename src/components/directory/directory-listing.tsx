import { Config } from "@/config";
import type { directoryEntries } from "@/db/schema";
import { ExternalLink, ImageIcon } from "lucide-react";

type DirectoryEntry = typeof directoryEntries.$inferSelect;

interface DirectoryListProps {
  items: DirectoryEntry[];
}

export default function DirectoryList({ items }: DirectoryListProps) {
  if (!items || items.length === 0) {
    return <p className="text-muted-foreground">ไม่พบรายการ</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-3 p-3 bg-card rounded-lg border"
        >
          {item.image ? (
            <img
              src={Config.getFileURL(item.image.id)}
              alt={item.name}
              className="w-12 h-12 rounded-md object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-md bg-muted flex-shrink-0 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 m-auto text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="font-medium block truncate">{item.name}</span>
          </div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center flex-shrink-0 mr-2"
          >
            <ExternalLink className="ml-1 w-4 h-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
