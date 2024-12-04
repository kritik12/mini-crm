import { LoaderIcon } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <section className="size-full fixed top-0 left-0 flex items-center justify-center bg-white/50">
      <LoaderIcon className="animate-spin" />
    </section>
  );
};
