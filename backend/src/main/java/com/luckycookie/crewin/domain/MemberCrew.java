package com.luckycookie.crewin.domain;

import com.luckycookie.crewin.domain.enums.Position;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Table(name="membercrew")
public class MemberCrew {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crew_id")
    private Crew crew;

    @Enumerated(EnumType.STRING)
    private Position position;

    private Boolean isJoined;

    private Boolean isInvited;

    public void updateMemberCrewInvitation(Boolean replyStatus) {
        if(replyStatus) { // 이때는 수락
            this.isInvited = true;
            this.isJoined = true; // 멤버 가입 완료
        } else { // 거절
            this.isInvited = false;
            this.isJoined = false;
        }
    }

    public void updatePosition(Position position) {
        this.position = position;
    }
}