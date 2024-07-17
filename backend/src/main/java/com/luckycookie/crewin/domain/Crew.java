package com.luckycookie.crewin.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Crew {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String captainName;

    private String slogan;

    private String area;

    private String introduction;

    private int memberCount;

    @Column(columnDefinition = "TEXT")
    private String mainLogo;

    @Column(columnDefinition = "TEXT")
    private String subLogo;

    @Column(columnDefinition = "TEXT")
    private String banner;

    private LocalDateTime crewBirth;
}
