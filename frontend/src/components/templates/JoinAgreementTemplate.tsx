import React from "react";
import JoinAgreememtOrganism from "../organisms/JoinAgreememtOrganism";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";

const JoinAgreementTemplate: React.FC = () => {
    return (
        <>
            <header>
                <BackHeaderMediumOrganism text="약관 동의" />
            </header>
            <main>
                <JoinAgreememtOrganism />
            </main>
        </>
    )
};

export default JoinAgreementTemplate;
