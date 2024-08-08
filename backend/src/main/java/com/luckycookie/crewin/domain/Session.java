package com.luckycookie.crewin.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.domain.enums.SessionType;
import com.luckycookie.crewin.dto.AttendanceRequest;
import com.luckycookie.crewin.dto.AttendanceRequest.StartAttendanceRequest;
import com.luckycookie.crewin.dto.SessionRequest;
import com.luckycookie.crewin.dto.SessionRequest.UpdateSessionRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Table(name = "session")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id")
    private Member host; // 주최자

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crew_id")
    private Crew crew;

    @Builder.Default
    @OneToMany(orphanRemoval = true, cascade = CascadeType.ALL, mappedBy = "session")
    private List<SessionPoster> posterImages = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private SessionType sessionType;

    private String name;

    private int pace;

    private String spot;
    private String area;
    private int maxPeople;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endAt;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Double lat;

    private Double lng;

    private LocalDateTime attendanceStart;

    public void setSessionPosters(List<SessionPoster> sessionPosters){
        this.posterImages = sessionPosters;
        for(SessionPoster sessionPoster : sessionPosters){
            sessionPoster.setImageSession(this);
        }
    }

    public void updateSession(UpdateSessionRequest updateSessionRequest, Course course) {
        this.course = course;
        this.sessionType = updateSessionRequest.getSessionType();
        this.name = updateSessionRequest.getName();
        this.pace = updateSessionRequest.getPace();
        this.spot = updateSessionRequest.getSpot();
        this.startAt = updateSessionRequest.getStartAt();
        this.endAt = updateSessionRequest.getEndAt();
        this.content = updateSessionRequest.getContent();
        this.posterImages.clear();
        if (updateSessionRequest.getImages() != null) {
            for (String imageUrl : updateSessionRequest.getImages()) {
                this.posterImages.add(SessionPoster.builder()
                        .imageUrl(imageUrl)
                        .session(this)
                        .build());
            }
        }
    }

    public void startSession(StartAttendanceRequest startAttendanceRequest) {
        lat = startAttendanceRequest.getLat();
        lng = startAttendanceRequest.getLng();
        attendanceStart = LocalDateTime.now();
    }

}
