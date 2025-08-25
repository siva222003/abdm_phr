import { Loader2 } from "lucide-react";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white/60  flex items-center justify-center">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  );
};

export default FullScreenLoader;
