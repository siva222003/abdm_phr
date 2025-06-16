import { CircleCheckIcon, CircleIcon, CircleXIcon } from "lucide-react";
import { JSX } from "react";

import { cn } from "@/lib/utils";

interface ValidationRuleProps {
  condition: boolean;
  content: JSX.Element | string;
  isInitialState?: boolean;
}

const ValidationRule = ({
  condition,
  content,
  isInitialState = false,
}: ValidationRuleProps) => {
  return (
    <div className="flex items-center gap-1">
      <span>
        {isInitialState ? (
          <CircleIcon className="size-4 text-gray-500" />
        ) : condition ? (
          <CircleCheckIcon className="size-4 text-green-500" />
        ) : (
          <CircleXIcon className="size-4 text-red-500" />
        )}
      </span>
      <span
        className={cn(
          isInitialState
            ? "text-black"
            : condition
              ? "text-primary-500"
              : "text-red-500",
        )}
      >
        {content}
      </span>
    </div>
  );
};

export default ValidationRule;
