import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import React from "react";

export const TagsFormField: React.FC<{
  tags: { tag: string; id: string }[];
  onAdd: (tag: string) => void;
  onRemove: (idx: number) => void;
}> = ({ tags, onAdd, onRemove }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium leading-none">แท็ก</label>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <li
            key={tag.id}
            className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded-md"
          >
            <span className="text-sm">{tag.tag}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              className="h-5 w-5 p-0"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </li>
        ))}
      </ul>
      <AddTagForm onSubmit={(tag) => onAdd(tag)} />
    </div>
  );
};

const AddTagForm: React.FC<{
  onSubmit: (tag: string) => void;
}> = ({ onSubmit }) => {
  const [tag, setTag] = React.useState("");

  return (
    <div className="flex gap-2">
      <Input
        className="flex-1"
        placeholder="เพิ่มแท็ก"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />
      <Button
        className="flex-shrink-0"
        variant="secondary"
        type="button"
        onClick={() => {
          if (tag.trim() === "") return;
          onSubmit(tag.trim());
          setTag("");
        }}
      >
        เพิ่มแท็ก
      </Button>
    </div>
  );
};
