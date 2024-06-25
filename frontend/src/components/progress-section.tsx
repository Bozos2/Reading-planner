import { useState, forwardRef } from "react";
import { cn } from "../lib/utils";
import BookInputForm from "./book-input-form";
import BooksList from "./books-list";

const ProgressSection = forwardRef<HTMLElement>((props, ref) => {
  const [activeButton, setActiveButton] = useState("button1");

  return (
    <section
      ref={ref}
      {...props}
      className="bg-background min-h-screen flex flex-col items-center"
    >
      <div className="flex flex-row gap-2 mt-12">
        <button
          className={cn(
            "px-6 py-2 text-lg font-semibold",
            { "text-third": activeButton !== "button1" },
            {
              "text-primary border-b-2 border-b-primary":
                activeButton === "button1",
            }
          )}
          onClick={() => setActiveButton("button1")}
        >
          In Progress
        </button>
        <button
          className={cn(
            "px-6 py-2 text-lg font-semibold",
            { "text-third": activeButton !== "button2" },
            {
              "text-primary border-b-2 border-b-primary":
                activeButton === "button2",
            }
          )}
          onClick={() => setActiveButton("button2")}
        >
          Completed
        </button>
      </div>
      <div className="mt-4">
        <BookInputForm isProgress={activeButton === "button1"} />
      </div>
      <div className="mt-6">
        <BooksList
          status={activeButton === "button1" ? "inprogress" : "completed"}
        />
      </div>
    </section>
  );
});

export default ProgressSection;
