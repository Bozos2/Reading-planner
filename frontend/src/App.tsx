import { useRef } from "react";
import { Navbar } from "./components/navbar";
import TechSection from "./components/tech-section";
import ProgressSection from "./components/progress-section";

function App() {
  const progressSectionRef = useRef<HTMLElement>(null);

  const handleGetStartedClick = () => {
    if (progressSectionRef.current) {
      progressSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main>
      <div className="min-h-screen  bg-image bg-center bg-cover">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/15 z-[2]" />
        <div className="flex flex-col items-start w-full">
          <Navbar onGetStartedClick={handleGetStartedClick} />
          <div className="z-50 flex items-center flex-col w-full font-mirza mt-16 md:mt-0">
            <h1 className="text-6xl md:text-8xl leading-[50px] font-bold max-w-[700px] text-center px-2 text-gray-900">
              Make your reading easier
            </h1>
            <p className="text-3xl pt-6 max-w-[700px] text-center px-2 opacity-80 text-gray-900">
              Track your reading progress of books! Stay organized and motivated
              by keeping track of your reading journey. Easily mark books as
              read, set reading goals, and visualize your progress. Perfect for
              avid readers looking to streamline their reading experience.
            </p>
            <button
              className="px-16 h-14  mt-8 bg-primary hover:bg-opacity-90 text-white font-mirza font-semibold rounded-lg text-lg hover:cursor-pointer tracking-wide"
              onClick={handleGetStartedClick}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
      <TechSection />
      <ProgressSection ref={progressSectionRef} />
    </main>
  );
}

export default App;
