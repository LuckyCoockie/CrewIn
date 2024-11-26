import { useNavigate } from "react-router";
import LargeAbleButton from "../../components/atoms/Button/LargeAbleButton";
import crewinIcon from "../../assets/icons/crewinicon.svg";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen p-10">
      <div className="text-center items-center w-[500px]">
        <img src={crewinIcon} className="w-[125px]" />
        <div className="text-xl py-10 font-bold text-[#A7A7A7]">
          이 페이지에 대한 접근권한이 없습니다.
        </div>
        <LargeAbleButton
          onClick={() => navigate("/", { replace: true })}
          text={"홈으로 가기"}
        />
      </div>
    </div>
  );
};

export default UnauthorizedPage;
