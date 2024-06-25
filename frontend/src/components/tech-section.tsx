import reactImage from "../images/react.png";
import golangImage from "../images/go.png";
import typescriptImage from "../images/typescript.png";
import queryImage from "../images/react-query.png";
import tailwindImage from "../images/tailwind.png";

const TechSection = () => {
  return (
    <ul className="py-6 px-2 md:px-14 w-full flex flex-wrap xl:grid gap-12 xl:gap-6 grid-cols-5 justify-center items-center">
      <li className="grayscale flex justify-center items-center hover:grayscale-0 hover:cursor-pointer">
        <img
          src={typescriptImage}
          alt="typescript"
          className="w-16 h-16 xl:w-24 xl:h-24"
        />{" "}
        <h1 className="text-2xl text-[#2F74C0] ml-2 font-bold">Typescript</h1>
      </li>
      <li className="grayscale flex justify-center items-center hover:grayscale-0 hover:cursor-pointer">
        <img
          src={golangImage}
          alt="golang"
          className="w-16 h-16 xl:w-24 xl:h-24"
        />
        <h1 className="text-2xl text-[#08AFD8] ml-2 font-bold">Golang</h1>
      </li>
      <li className="grayscale flex justify-center items-center hover:grayscale-0 hover:cursor-pointer">
        <img
          src={reactImage}
          alt="react"
          className="w-16 h-16 xl:w-24 xl:h-24"
        />
        <h1 className="text-2xl text-[#61DBFB] ml-2 font-bold">React</h1>
      </li>
      <li className="grayscale flex justify-center items-center hover:grayscale-0 hover:cursor-pointer">
        <img
          src={queryImage}
          alt="react query"
          className="w-16 h-16 xl:w-24 xl:h-24"
        />
        <h1 className="text-2xl text-[#FF4154] ml-2 font-bold">React Query</h1>
      </li>
      <li className="grayscale flex justify-center items-center hover:grayscale-0 hover:cursor-pointer">
        <img
          src={tailwindImage}
          alt="tailwindcss"
          className="w-16 h-16 xl:w-24 xl:h-24"
        />
        <h1 className="text-2xl text-[#0BB5D5] ml-2 font-bold">Tailwind CSS</h1>
      </li>
    </ul>
  );
};

export default TechSection;
