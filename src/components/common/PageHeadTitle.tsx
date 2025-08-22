import { useEffect } from "react";

export interface IPageTitleProps {
  title: string;
}

export default function PageTitle({ title }: IPageTitleProps) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = title + " | Cura";
    } else {
      document.title = "Cura";
    }
    return () => {
      document.title = prevTitle;
    };
  }, [title]);

  return <></>;
}
