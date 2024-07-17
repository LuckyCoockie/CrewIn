import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface IFormInput {
  username: string;
  email: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters long"),
  email: yup.string().required("Email is required").email("Email is not valid"),
});

const CrewCreatePage: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const watchedUsername = watch("username");
  const watchedEmail = watch("email");

  useEffect(() => {
    setUsername(watchedUsername);
    trigger("username"); // Trigger validation on username field
  }, [watchedUsername, trigger]);

  useEffect(() => {
    setEmail(watchedEmail);
    trigger("email"); // Trigger validation on email field
  }, [watchedEmail, trigger]);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  return (
    <>
      <form action="">
        <p>
          {/* 크루명 */}
          <label htmlFor="crew_name">크루명</label>
          <input type="text" id="crew_name" />
        </p>
        <p>
          {/* 슬로건 */}
          <label htmlFor="slogan">슬로건</label>
          <input type="text" id="slogan" />
        </p>
        <p>
          {/* 활동 지역 */}
          <label htmlFor="area">활동 지역</label>
          <input type="text" id="area" />
        </p>
        <p>
          {/* 크루 생성일 */}
          <label htmlFor="crew_birth">크루 생성일</label>
          <input type="text" id="crew_birth" />
        </p>
        <p>
          {/* 소개 문구 */}
          <label htmlFor="introduction">소개 문구</label>
          <input type="text" id="introduction" />
        </p>
        <p>
          {/* 메인 로고 */}
          <label htmlFor="main_logo">메인 로고</label>
          <input type="text" id="main_logo" />
        </p>
        <p>
          {/* 서브 로고 */}
          <label htmlFor="sub_logo">서브 로고</label>
          <input type="text" id="sub_logo" />
        </p>
        <p>
          {/* 배너 */}
          <label htmlFor="banner">배너</label>
          <input type="text" id="banner" />
        </p>
      </form>
      <div className="flex items-center justify-center p-4">
        <div className="mx-auto w-full max-w-[550px]">
          <form action="" method="POST">
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label htmlFor="fName" className="mb-3 block">
                    크루명
                  </label>
                  <input
                    type="text"
                    name="fName"
                    id="fName"
                    placeholder="크루명"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label htmlFor="lName" className="mb-3 block">
                    슬로건
                  </label>
                  <input
                    type="text"
                    name="lName"
                    id="lName"
                    placeholder="슬로건"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>
            <div className="mb-5">
              <label htmlFor="guest" className="mb-3 block">
                How many guest are you bringing?
              </label>
              <input
                type="number"
                name="guest"
                id="guest"
                placeholder="5"
                min="0"
                className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label htmlFor="date" className="mb-3 block">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label htmlFor="time" className="mb-3 block">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-3 block">Are you coming to the event?</label>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="radio1"
                    id="radioButton1"
                    className="h-5 w-5"
                  />
                  <label htmlFor="radioButton1" className="pl-3">
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="radio1"
                    id="radioButton2"
                    className="h-5 w-5"
                  />
                  <label htmlFor="radioButton2" className="pl-3">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-centerutline-none">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="username">Username</label>
            <input id="username" {...register("username")} />
            {username && errors.username && <p>{errors.username.message}</p>}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input id="email" {...register("email")} />
            {email && errors.email && <p>{errors.email.message}</p>}
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default CrewCreatePage;
