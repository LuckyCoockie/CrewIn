package com.luckycookie.crewin.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.dto.CrewRequest;
import com.luckycookie.crewin.dto.CrewRequest.CreateCrewRequest;
import com.luckycookie.crewin.repository.CrewRepository;
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
@Table(name="crew")
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

    public void updateCrewInfo(CreateCrewRequest createCrewRequest) {
        this.crewName = createCrewRequest.getName();
        this.slogan = createCrewRequest.getSlogan();
        this.area = createCrewRequest.getArea();
        this.introduction = createCrewRequest.getIntroduction();
        this.mainLogo = createCrewRequest.getMainLogo();
        this.subLogo = createCrewRequest.getSubLogo();
        this.banner = createCrewRequest.getBanner();
        this.crewBirth = createCrewRequest.getCrewBirth();
    }
}
