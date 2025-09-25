import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PaginationNav: React.FC<{
  page: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}> = ({ page, totalPages, onNextPage, onPrevPage }) => {
  return (
    <div className="flex justify-start items-center space-x-2">
      <p className="text-sm">Page {page}</p>
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={onPrevPage}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={totalPages === 0 || page === totalPages}
        onClick={onNextPage}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
