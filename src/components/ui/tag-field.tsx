import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateTag } from "@/hooks/tag/mutations";
import { useGetAllTags } from "@/hooks/tag/queries";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X, XCircle } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Loader } from "../common/loader";

interface TagFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  className?: string;
  type: string;
}

export const TagField: React.FC<TagFieldProps> = ({
  value,
  onChange,
  multiple = true,
  placeholder = "Select or create tags...",
  type,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const { data: tags = [], isLoading } = useGetAllTags(type);
  const createTagMutation = useCreateTag();

  const availableTags = tags.filter((tag) => !value.includes(tag));

  const handleSelect = (tag: string) => {
    if (multiple) {
      if (value.includes(tag)) {
        onChange(value.filter((t) => t !== tag));
      } else {
        onChange([...value, tag]);
      }
    } else {
      onChange([tag]);
      setOpen(false);
    }
    setInputValue("");
  };

  const handleCreateTag = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    // Check if tag already exists
    if (tags.includes(trimmedValue)) {
      handleSelect(trimmedValue);
      return;
    }

    try {
      await createTagMutation.mutateAsync({ name: trimmedValue, type });
      handleSelect(trimmedValue);
      toast.success(`Tag "${trimmedValue}" created`);
    } catch (error) {
      toast.error("Failed to create tag");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const showCreateOption =
    inputValue.trim() &&
    !tags.includes(inputValue.trim()) &&
    !value.includes(inputValue.trim()) &&
    filteredTags.length === 0;

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-10 h-auto"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {value.length > 0 ? (
                value.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-2 py-0.5"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(tag);
                      }}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="opacity-50 ml-2 flex-shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search tags..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader />
                  </div>
                ) : (
                  "No tags found."
                )}
              </CommandEmpty>
              {(filteredTags.length > 0 || showCreateOption) && (
                <CommandGroup>
                  {filteredTags.map((tag) => (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={() => handleSelect(tag)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.includes(tag) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {tag}
                    </CommandItem>
                  ))}
                  {showCreateOption && (
                    <CommandItem
                      value={`create-${inputValue.trim()}`}
                      onSelect={handleCreateTag}
                      disabled={createTagMutation.isPending}
                    >
                      {createTagMutation.isPending ? (
                        <Loader />
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Create "{inputValue.trim()}"
                        </>
                      )}
                    </CommandItem>
                  )}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
