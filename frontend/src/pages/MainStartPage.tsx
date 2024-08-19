import React, { useEffect, useRef } from "react";
import startOne from "../assets/images/Start_1.png";
import startTwo from "../assets/images/Start_2.png";
import startThree from "../assets/images/Start_3.png";
import startFour from "../assets/images/Start_4.png";
import startFive from "../assets/images/Start_5.png";
import mainrunningposter1 from "../assets/images/mainrunning1.jpg";
import mainrunningposter2 from "../assets/images/mainrunning2.jpg";
import mainrunningposter3 from "../assets/images/mainrunning3.jpg";
import mainrunningposter4 from "../assets/images/mainrunning4.jpg";
import mainrunningposter5 from "../assets/images/mainrunning5.jpg";
import mainrunningposter6 from "../assets/images/mainrunning6.jpg";
import mainsessionposter1 from "../assets/images/mainsession1.jpg";
import mainsessionposter2 from "../assets/images/mainsession2.jpg";
import mainsessionposter3 from "../assets/images/mainsession3.jpg";
import mainsessionposter4 from "../assets/images/mainsession4.jpg";
import mainsessionposter5 from "../assets/images/mainsession5.jpg";
import mainsessionposter6 from "../assets/images/mainsession6.jpg";
import "../styles/fade-in.css";

import LargeAbleButton from "../components/atoms/Button/LargeAbleButton";
import { useNavigate } from "react-router";

const StartPage: React.FC = () => {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const horizontalScrollRef1 = useRef<HTMLDivElement>(null);
  const horizontalScrollRef2 = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            entry.target.classList.remove("fade-out");
          } else {
            entry.target.classList.remove("fade-in");
            entry.target.classList.add("fade-out");
          }
        });
      },
      {
        threshold: 0.4,
      }
    );

    imagesRef.current.forEach((image) => {
      if (image) observer.observe(image);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const setupAutoScroll = (
    scrollContainer: HTMLDivElement | null,
    scrollSpeed: number,
    reverse: boolean = false
  ) => {
    if (!scrollContainer) return;

    const autoScroll = () => {
      if (reverse) {
        if (scrollContainer.scrollLeft <= 0) {
          scrollContainer.scrollLeft = scrollContainer.scrollWidth;
        } else {
          scrollContainer.scrollLeft -= scrollSpeed;
        }
      } else {
        if (
          scrollContainer.scrollLeft + scrollContainer.clientWidth >=
          scrollContainer.scrollWidth
        ) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += scrollSpeed;
        }
      }
    };

    const intervalId = setInterval(autoScroll, 20);

    return () => {
      clearInterval(intervalId);
    };
  };

  useEffect(() => {
    const clearScroll1 = setupAutoScroll(horizontalScrollRef1.current, 1);
    const clearScroll2 = setupAutoScroll(horizontalScrollRef2.current, 1, true);

    return () => {
      if (clearScroll1) clearScroll1();
      if (clearScroll2) clearScroll2();
    };
  }, []);

  const clickrouter = () => {
    navigate(`/login`);
  };

  return (
    <>
      <div className="bg-gray-100 sm:bg-white relative pb-1">
        <img
          ref={(el) => el && imagesRef.current.push(el)}
          src={startOne}
          alt="startOne"
          className="px-1 my-1 start-image snap-center"
        />
        <img
          ref={(el) => el && imagesRef.current.push(el)}
          src={startTwo}
          alt="startTwo"
          className="px-1 my-1 start-image snap-center"
        />
        <img
          ref={(el) => el && imagesRef.current.push(el)}
          src={startThree}
          alt="startThree"
          className="px-1 my-1 start-image snap-center"
        />
        <img
          ref={(el) => el && imagesRef.current.push(el)}
          src={startFour}
          alt="startFour"
          className="px-1 my-1 start-image snap-center"
        />
        <img
          ref={(el) => el && imagesRef.current.push(el)}
          src={startFive}
          alt="startFive"
          className="px-1 my-1 start-image snap-center"
        />

        {/* 가로 스크롤 섹션 1 (오른쪽으로 스크롤) */}
        <div className="mx-1 bg-white rounded-xl my-1 pb-4 pt-3">
          <div className="text-2xl sm:text-4xl ms-3 font-black text-color mt-3">
            다양한 크루
          </div>
          <div
            className="mt-3 font-medium sm:font-semibold sm:text-xl text-gray-500 ms-3"
            style={{ fontSize: "15px" }}
          >
            찾아 헤매지 말고 지역, 이름으로 간편한 크루 검색
          </div>
          <div
            className="mb-3 font-medium sm:font-semibold sm:text-xl text-gray-500 ms-3"
            style={{ fontSize: "15px" }}
          >
            크루들은 어떻게 활동하고 있을까?
          </div>
          <div
            ref={horizontalScrollRef1}
            className="flex overflow-x-scroll space-x-4 py-2 snap-x snap-mandatory scrollbar-hide"
          >
            <img
              src={mainrunningposter1}
              alt="additionalOne"
              className="w-72 h-72 object-cover rounded-lg"
            />
            <img
              src={mainrunningposter2}
              alt="additionalTwo"
              className="w-72 h-72 object-cover rounded-lg"
            />
            <img
              src={mainrunningposter3}
              alt="additionalThree"
              className="w-72 h-72 object-cover rounded-lg"
            />
            <img
              src={mainrunningposter4}
              alt="additionalFour"
              className="w-72 h-72 object-cover rounded-lg"
            />
            <img
              src={mainrunningposter5}
              alt="additionalFive"
              className="w-72 h-72 object-cover rounded-lg"
            />
            <img
              src={mainrunningposter6}
              alt="additionalSix"
              className="w-72 h-72 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* 가로 스크롤 섹션 2 (왼쪽으로 스크롤) */}
        <div className="mx-1 bg-white rounded-xl my-2 pb-4 pt-3">
          <div className="text-2xl sm:text-4xl ms-3 font-black text-color mt-3">
            수 많은 세션
          </div>
          <div
            className="mt-3 font-medium sm:font-semibold sm:text-xl text-gray-500 ms-3"
            style={{ fontSize: "15px" }}
          >
            쉽게 세션에 참가신청
          </div>
          <div
            className="mb-3 font-medium sm:font-semibold sm:text-xl text-gray-500 ms-3"
            style={{ fontSize: "15px" }}
          >
            번개런, 정규런, 오픈런 총 3가지 선택
          </div>
          <div
            ref={horizontalScrollRef2}
            className="flex overflow-x-scroll space-x-4 py-2 snap-x snap-mandatory scrollbar-hide"
          >
            <img
              src={mainsessionposter1}
              alt="additionalOne"
              className="w-72 h-72 object-cover rounded-lg"
            />
            <img
              src={mainsessionposter2}
              alt="additionalTwo"
              className="w-72 h-72 object-cover rounded-lg"
            />
            <img
              src={mainsessionposter3}
              alt="additionalThree"
              className="w-72 h-72 object-cover rounded-lg"
            />
            <img
              src={mainsessionposter4}
              alt="additionalFour"
              className="w-72 h-72 object-cover rounded-lg"
            />
            <img
              src={mainsessionposter5}
              alt="additionalFive"
              className="w-72 h-72 object-cover rounded-lg"
            />
            <img
              src={mainsessionposter6}
              alt="additionalSix"
              className="w-72 h-72 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* 하단 중앙에 고정된 버튼 */}
        <div
          className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white pb-4 px-4 pt-2"
          style={{ maxWidth: "500px" }}
        >
          <LargeAbleButton text="CREW-IN 입장" onClick={clickrouter} />
        </div>
      </div>
    </>
  );
};

export default StartPage;
