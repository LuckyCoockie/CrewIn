// import React from "react";
// import { ReactComponent as Searchbox } from "../../../assets/icons/searchbox.svg";
// import { ReactComponent as CrewinLogo } from "../../../assets/icons/crewinlogo.svg";
// import { CrewMemberDto } from "../../../apis/api/crewsearch";
// import BackHeaderMediumOrganism from "../../../components/organisms/BackHeaderMediumOrganism";

// interface CrewInviteTemplateProps {
//   query: string;
//   members: CrewMemberDto[];
//   searching: boolean;
//   handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   handleInviteClick: (member: CrewMemberDto) => void;
//   setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const CrewInviteTemplate: React.FC<CrewInviteTemplateProps> = ({
//   query,
//   members,
//   searching,
//   handleSearchChange,
//   handleInviteClick,
//   setShowDropdown,
// }) => {
//   const renderMemberList = (
//     filterFn: (member: CrewMemberDto) => boolean,
//     title: string
//   ) => (
//     <div className="">
//       <h2 className="text-lg font-bold mb-2 ml-4">{title}</h2>
//       <ul>
//         {members.filter(filterFn).length === 0 ? (
//           <div></div>
//         ) : (
//           members.filter(filterFn).map((member) => (
//             <li
//               key={member.memberId}
//               className="flex items-center p-2 border-b"
//             >
//               <div className="w-12 h-12 flex-shrink-0">
//                 {member.imageUrl ? (
//                   <img
//                     src={member.imageUrl}
//                     alt={member.name}
//                     className="w-full h-full object-cover rounded-full"
//                   />
//                 ) : (
//                   <CrewinLogo className="w-full h-full object-cover rounded-full" />
//                 )}
//               </div>
//               <div className="flex-1 ml-3">
//                 <div className="font-bold">{member.name}</div>
//                 <div className="text-gray-600">{member.nickname}</div>
//               </div>
//               <div className="flex gap-2">
//                 {member.isInvited ? (
//                   <button
//                     className="border border-gray-400 w-20 h-10 rounded-md text-sm bg-gray-200 cursor-not-allowed"
//                     disabled
//                   >
//                     초대 중
//                   </button>
//                 ) : (
//                   <button
//                     className="border border-gray-400 w-20 h-10 rounded-md text-sm"
//                     onClick={() => handleInviteClick(member)}
//                   >
//                     초대하기
//                   </button>
//                 )}
//               </div>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );

//   return (
//     <div className="relative flex flex-col max-w-[550px] mx-auto">
//       <header className="mb-1">
//         <BackHeaderMediumOrganism text="" />
//         <div className="relative flex-1 font-weight-sm">
//           <input
//             type="search"
//             className="h-6 px-4 pr-12 text-md w-full focus:outline-none focus:ring-0 border-none"
//             placeholder="이름, 닉네임"
//             value={query}
//             onChange={handleSearchChange}
//             onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
//             onFocus={() => setShowDropdown(true)}
//           />
//           <button
//             type="button"
//             onClick={() =>
//               handleSearchChange({
//                 target: { value: query },
//               } as React.ChangeEvent<HTMLInputElement>)
//             }
//             className="absolute inset-y-0 right-0 flex items-center pr-4 bg-transparent"
//           >
//             <Searchbox className="text-gray-600 h-5 w-5 fill-current" />
//           </button>
//         </div>
//       </header>

//       {searching ? (
//         <p>Searching members...</p>
//       ) : (
//         <>
//           {renderMemberList(
//             (member) =>
//               (member.isJoined === false || member.isJoined === null) &&
//               (member.isInvited === false || member.isInvited === null),
//             "Invitation Allowed"
//           )}
//           {renderMemberList(
//             (member) =>
//               (member.isJoined === false || member.isJoined === null) &&
//               member.isInvited === true,
//             "Invitation in Progress"
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default CrewInviteTemplate;
