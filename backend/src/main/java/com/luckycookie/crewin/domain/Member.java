package com.luckycookie.crewin.domain;

import com.luckycookie.crewin.domain.enums.Role;
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
@Table(name="member")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String nickname;

    private String email;

    private String password;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private Boolean existNotification;

    @Enumerated(EnumType.STRING)
    private Role role;

    private int totalDistance;

    private int totalTime;

    private int totalAttendance;

    public void changePassword(String newPassword){
        this.password = newPassword;
    }

    public void updateMemberNotification(boolean bool) { this.existNotification = bool; }

    public void updateProfileImage(String profileImageUrl) {
        this.imageUrl = profileImageUrl;
    }

    public void changeNickname(String newNickname){ this.nickname = newNickname; }

}
