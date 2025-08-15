import { CheckCircle2 } from "lucide-react";
import React from "react";

const stepsLabels = ["Search", "Discover", "Verify"];

const StepIndicator = ({ step }: { step: number }) => {
  return (
    <div className="px-4 sm:px-6">
      <div className="flex items-center justify-center gap-2 sm:gap-6 mb-3">
        {stepsLabels.map((label, idx) => {
          const isActive = step === idx + 1;
          const isDone = step > idx + 1;
          const isLast = idx === stepsLabels.length - 1;

          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1 min-w-[50px] sm:min-w-[60px]">
                <div
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Step ${idx + 1} of ${stepsLabels.length}: ${label}`}
                  className={`size-9 rounded-full grid place-items-center border font-medium transition-all duration-200
                    ${
                      isDone
                        ? "bg-primary text-white border-primary"
                        : isActive
                          ? "bg-secondary text-foreground border-border scale-110 shadow-sm"
                          : "bg-background text-muted-foreground border-border"
                    }`}
                >
                  {isDone ? <CheckCircle2 className="size-5" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] sm:text-sm text-center leading-tight transition-colors duration-200
                    ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-px mx-1 sm:mx-2 transition-colors duration-300
                    ${isDone ? "bg-primary" : "bg-muted-foreground/30"}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
