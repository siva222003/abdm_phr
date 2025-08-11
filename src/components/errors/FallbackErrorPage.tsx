import { navigate } from "raviger";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type ErrorType = "PAGE_NOT_FOUND" | "PAGE_LOAD_ERROR";

interface FallbackErrorPageProps {
  forError?: ErrorType;
  title?: string;
  message?: string;
  image?: string;
}

export default function FallbackErrorPage({
  forError = "PAGE_NOT_FOUND",
  ...props
}: FallbackErrorPageProps) {
  useEffect(() => {
    toast.dismiss();
  }, []);

  const errorContent = {
    PAGE_NOT_FOUND: {
      image: "/images/404.svg",
      title: "404 Not Found",
      message: "Sorry, the page you are looking for does not exist.",
    },
    PAGE_LOAD_ERROR: {
      image: "/images/404.svg",
      title: "Page Load Error",
      message: "Could not load the page. Please try again later.",
    },
  };

  const { image, title, message } = {
    ...errorContent[forError],
    ...props,
  };

  return (
    <div className="flex h-screen items-center justify-center text-center">
      <div className="w-[500px] text-center">
        <img src={image} alt={title} className="w-full" />
        <h1 className="mt-4">{title}</h1>
        <p>
          {message}
          <br />
          <br />
          <Button
            onClick={() => {
              navigate("/dashboard");
              window.location.reload();
            }}
            className="inline-block rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 hover:text-white"
          >
            Go to Home
          </Button>
        </p>
      </div>
    </div>
  );
}
