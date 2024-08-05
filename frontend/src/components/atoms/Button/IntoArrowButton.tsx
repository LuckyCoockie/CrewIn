import React from "react";
import { ReactComponent as IntoArrowIcon } from "../../../assets/icons/intoarrow.svg";
import { useNavigate } from "react-router";

type Props = {
  router: string
};

const IntoArrowButton: React.FC<Props> = ({ router }) => {
    const navigate = useNavigate()
    const moveRouter = () => {
        navigate(router)
    }
  return <IntoArrowIcon onClick={moveRouter} className="cursor-pointer"/>;
};

export default IntoArrowButton;
