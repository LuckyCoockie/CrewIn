import React, { useEffect, useRef } from "react";
import startOne from "../assets/images/Start_1.png";
import startTwo from "../assets/images/Start_2.png";
import startThree from "../assets/images/Start_3.png";
import startFour from "../assets/images/Start_4.png";
import startFive from "../assets/images/Start_5.png";
import "../styles/fade-in.css"

import LargeAbleButton from "../components/atoms/Button/LargeAbleButton";
import { useNavigate } from "react-router";

const StartPage: React.FC = () => {
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const navigate = useNavigate()

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
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
                threshold: 0.4
            }
        );

        imagesRef.current.forEach(image => {
            if (image) observer.observe(image);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const clickrouter = () => {
        navigate(`/login`)
    }
    return (
        <>
            <div className="bg-gray-100 relative">
                <img ref={el => el && imagesRef.current.push(el)} src={startOne} alt="startOne" className="px-1 my-1 start-image" />
                <img ref={el => el && imagesRef.current.push(el)} src={startTwo} alt="startTwo" className="px-1 my-1 start-image" />
                <img ref={el => el && imagesRef.current.push(el)} src={startThree} alt="startThree" className="px-1 my-1 start-image" />
                <img ref={el => el && imagesRef.current.push(el)} src={startFour} alt="startFour" className="px-1 my-1 start-image" />
                <img ref={el => el && imagesRef.current.push(el)} src={startFive} alt="startFive" className="px-1 my-1 start-image" />

                {/* 하단 중앙에 고정된 버튼 */}
                <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 w-full max-w-md">
                    <LargeAbleButton text="CREW-IN 입장" onClick={clickrouter} />
                </div>
            </div>
        </>
    );
};

export default StartPage;
