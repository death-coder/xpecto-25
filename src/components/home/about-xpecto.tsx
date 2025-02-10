import React from "react";
import StaggeredText from "@/components/home/staggered-text";
import Image from "next/image";
import StaticImg from "public/images/img.png";
import { Share_Tech } from "next/font/google";

const shareTech = Share_Tech({ weight: "400", subsets: ["latin"] });

const AboutXpecto = () => {
  return (
    <div className="mx-5 flex flex-col items-center gap-12 md:flex-row">
      <div>
        <StaggeredText>About xpecto &apos;25</StaggeredText>
        <div
          className={`max-w-screen-sm ${shareTech.className} mt-2 text-base leading-normal tracking-tight lg:text-lg`}
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias
          assumenda ea eligendi expedita laboriosam magnam minus mollitia
          necessitatibus nemo nesciunt nisi optio perspiciatis provident quasi,
          quia quod temporibus vero. Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Amet consequuntur cum eligendi explicabo, facilis in
          incidunt labore libero, nam nemo neque officia quis quisquam ratione
          reiciendis reprehenderit saepe, sequi? Obcaecati! Lorem ipsum dolor
          sit amet, consectetur adipisicing elit. A assumenda debitis eligendi
          facere neque pariatur placeat provident quas totam! Dolore laboriosam
          officia ullam? Aperiam distinctio id, illum molestiae quis soluta!
        </div>
      </div>
      <Image
        src={StaticImg}
        alt={"Placeholder"}
        className="w-[300px] object-cover lg:w-[400px]"
      />
    </div>
  );
};

export default AboutXpecto;
