import React from "react";
// import { useQuery } from "react-query";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import PeopleRecordInfoOrganism from "../organisms/people/PeopleRecordInfoOrganism";
import PeopleAlbumOrganism from "../organisms/people/PeopleAlbumOrganism";

const PeopleProfileTemplate: React.FC = () => {
  return (
    <>
      <header>
        <BackHeaderMediumOrganism text="상대방 닉네임" />
      </header>
      <PeopleRecordInfoOrganism />
      <div>
        <PeopleAlbumOrganism />
      </div>
    </>
  );
};

export default PeopleProfileTemplate;
