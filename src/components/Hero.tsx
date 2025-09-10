import Link from "next/link";
import { Button } from "./ui/button";

const HeroSection = () => {
  return (
    <section className=" h-[70%] flex flex-col items-center justify-center hero-bg text-center">
      <div className="flex items-center justify-between w-full max-w-6xl p-4 mb-4">
        <div className=" ring-1 ring-gray-300  px-4 py-1 rounded-full   text-center mx-auto" >
          <span className="text-sm font-medium">AI Generator Membership - Join Now</span>
        </div>
      </div>

      <h1 className="text-6xl font-bold text-gray-800">
        AI Content <span className="text-mainColor">Generator</span>
      </h1>

      <p className="mt-4 text-xl text-gray-500 max-w-2xl">
        Revolutionize your content creation with our AI-powered app, delivering engaging and high-quality text in seconds.
      </p>

      <Link href='/dashboard/'
         > 
         <Button
                   className=" bg-mainColor hover:bg-transparent mt-3 hover:text-mainColor hover:ring-mainColor border ring-mainColor py-6 px-5 text-white text-2xl hover:scale-105"

          >
 Get started
         </Button>
      </Link>
    </section>
  );
};

export default HeroSection;
