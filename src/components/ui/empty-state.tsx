import { Card } from "@/components/ui/card";

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <Card className="items-center justify-center gap-0 p-8 text-center border-dashed">
      <div className="rounded-full bg-primary/10 p-3 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
    </Card>
  );
}
