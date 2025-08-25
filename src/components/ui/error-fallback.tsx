import { ArrowLeft, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorFallbackProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: () => void;
  actionText?: string;
}

export function ErrorFallback({
  icon: Icon = ShieldAlert,
  title,
  description,
  action,
  actionText = "Go Back",
}: ErrorFallbackProps) {
  return (
    <div className="flex justify-center items-center">
      <Card className="w-full text-center shadow-sm border border-dashed border-red-300">
        <CardContent className="space-y-6 py-8">
          <div className="flex justify-center">
            <Icon className="h-12 w-12 text-red-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>

          <Button variant="outline" className="mt-1" onClick={action}>
            <ArrowLeft className="mr-2 size-4" />
            {actionText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
