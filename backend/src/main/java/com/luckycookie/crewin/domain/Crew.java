package com.luckycookie.crewin.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.dto.CrewRequest.CrewInfoRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Table(name = "crew")
public class Crew {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String crewName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "captain_id")
    private Member captain;

    private String slogan;

    private String area;

    private String introduction;

    @Column(columnDefinition = "TEXT")
    private String mainLogo;

    @Column(columnDefinition = "TEXT")
    private String subLogo;

    @Column(columnDefinition = "TEXT")
    private String banner;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate crewBirth;

    public void updateCrewInfo(CrewInfoRequest crewInfoRequest) {
        this.crewName = crewInfoRequest.getName();
        this.slogan = crewInfoRequest.getSlogan();
        this.area = crewInfoRequest.getArea();
        this.introduction = crewInfoRequest.getIntroduction();
        this.mainLogo = crewInfoRequest.getMainLogo();
        this.subLogo = crewInfoRequest.getSubLogo();
        this.banner = crewInfoRequest.getBanner();
        this.crewBirth = crewInfoRequest.getCrewBirth();
    }

    public void changeCaptain(Member member) {
        this.captain = member;
    }
}
