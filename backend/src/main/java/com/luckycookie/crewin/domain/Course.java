package com.luckycookie.crewin.domain;

import com.luckycookie.crewin.dto.CourseRequest;
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
@Table(name="course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private Member creator;

    // 코스 정보 (json)
    @Column(columnDefinition = "JSON")
    private String info;

    private String name;
    private String area;
    private Double length;

    @Column(columnDefinition = "TEXT")
    private String thumbnailImage ;

    public void updateCourse(CourseRequest.UpdateCourseRequest updateCourseRequest) {
        this.info = updateCourseRequest.getInfo();
        this.name = updateCourseRequest.getName();
        this.area = updateCourseRequest.getArea();
        this.length = updateCourseRequest.getLength();
        this.thumbnailImage = updateCourseRequest.getThumbnailImage();
    }
}
