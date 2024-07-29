package com.luckycookie.crewin.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.domain.enums.PostType;
import com.luckycookie.crewin.dto.CrewRequest;
import com.luckycookie.crewin.dto.PostRequest;
import com.luckycookie.crewin.exception.post.InvalidPostTypeException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@DynamicInsert
@Table(name="post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crew_id")
    private Crew crew;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private Member author;
    private String content;

    @CreatedDate
    @Column(updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    private Boolean isPublic;

    @Enumerated(EnumType.STRING)
    private PostType postType;

    private String title;

    @Builder.Default
    @OneToMany(orphanRemoval = true, cascade = CascadeType.ALL, mappedBy = "post")
    private List<PostImage> postImages = new ArrayList<>();

    @Builder.Default
    @OneToMany(orphanRemoval = true, cascade = CascadeType.ALL, mappedBy = "post")
    private List<Heart> hearts = new ArrayList<>();


    public void updatePost(PostRequest.UpdatePostRequest updatePostRequest) {
        this.title = updatePostRequest.getTitle();
        this.content = updatePostRequest.getContent();
        this.isPublic = updatePostRequest.getIsPublic();

        this.postImages.clear();
        if (updatePostRequest.getPostImages() != null) {
            for (String imageUrl : updatePostRequest.getPostImages()) {
                this.postImages.add(PostImage.builder()
                        .imageUrl(imageUrl)
                        .post(this)
                        .build());
            }
        }
    }

    public void updateCrewNotice(CrewRequest.CreateCrewNoticeRequest createCrewNoticeRequest) {
        this.title = createCrewNoticeRequest.getTitle();
        this.content = createCrewNoticeRequest.getContent();

        this.postImages.clear();
        if(createCrewNoticeRequest.getNoticeImages() != null) {
            for(String imageUrl : createCrewNoticeRequest.getNoticeImages()) {
                this.postImages.add(PostImage.builder()
                        .imageUrl(imageUrl)
                        .post(this).build());
            }
        }
    }
}
