package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Notification;
import com.luckycookie.crewin.domain.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByReceiver(Member receiver);

    @Modifying(clearAutomatically = true)
    int deleteBySenderIdAndReceiverIdAndPostId(Long senderId, Long receiverId, Long postId);

    @Modifying(clearAutomatically = true)
    void deleteByNotificationTypeAndSenderId(NotificationType notificationType, Long senderId);

    @Modifying(clearAutomatically = true)
    @Query("delete from Notification n where n.notificationType in :notificationTypes and n.senderId = :crewId")
    void deleteNoticeAndInvitationByCrewId(List<NotificationType> notificationTypes, Long crewId);

    @Modifying(clearAutomatically = true)
    @Query("delete from Notification n where n.notificationType in :notificationTypes and n.senderId = :crewId and n.receiver = :member")
    void deleteNotificationByCrewIdAndMemberId(List<NotificationType> notificationTypes, Long crewId, Member member);
}
