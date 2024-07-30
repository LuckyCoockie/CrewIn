package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Crew;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Notification;
import com.luckycookie.crewin.domain.enums.NotificationType;
import com.luckycookie.crewin.dto.NotificationResponse;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.notification.NotFoundNotificationException;
import com.luckycookie.crewin.exception.notification.NotMatchMemberNotificationError;
import com.luckycookie.crewin.repository.CrewRepository;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.repository.NotificationRepository;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final MemberRepository memberRepository;
    private final CrewRepository crewRepository;
    private final NotificationRepository notificationRepository;

    public void createNotification(NotificationType notificationType, Long senderId, Long receiverId, Long postId) {
        Member receiver = memberRepository.findById(receiverId)
                .orElseThrow(NotFoundMemberException::new);

        notificationRepository.save(
                Notification
                        .builder()
                        .isChecked(Boolean.FALSE)
                        .notificationType(notificationType)
                        .senderId(senderId)
                        .postId(postId)
                        .receiver(receiver)
                        .build());

        receiver.updateMemberNotification(true);
        memberRepository.save(receiver);

    }

    public List<NotificationResponse> getMemberNotifications(CustomUser customUser) {
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        member.updateMemberNotification(false); // 알림들을 읽었다고 표시
        memberRepository.save(member);

        List<Notification> notificationList = notificationRepository.findByReceiver(member);
        return notificationList.stream()
                .map(this::convertToDto) // convertToDto 메서드를 사용하여 변환
                .collect(Collectors.toList());
    }

    private NotificationResponse convertToDto(Notification notification) {
        String senderName;
        String senderThumbnail;
        switch (notification.getNotificationType()) {
            case NOTICE:
            case INVITATION:
                Crew crew = crewRepository.findById(notification.getSenderId())
                        .orElseThrow(NotFoundCrewException::new);
                senderName = crew.getCrewName();
                senderThumbnail = crew.getMainLogo();
                break;
            case LIKE:
                Member member = memberRepository.findById(notification.getSenderId())
                        .orElseThrow(NotFoundMemberException::new);
                senderName = member.getName();
                senderThumbnail = member.getImageUrl();
                break;
            default:
                senderName = "";
                senderThumbnail = "";

        }

        return NotificationResponse.builder()
                .notificationId(notification.getId())
                .isChecked(notification.getIsChecked())
                .notificationType(notification.getNotificationType())
                .postId(notification.getPostId())
                .senderId(notification.getSenderId())
                .createdAt(notification.getCreatedAt())
                .senderName(senderName)
                .senderThumbnail(senderThumbnail)
                .build();
    }

    public void deleteNotification(CustomUser customUser, Long notificationId) {
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(NotFoundNotificationException::new);
        if (notification.getReceiver().equals(member)) {
            notificationRepository.delete(notification);
        } else {
            throw new NotMatchMemberNotificationError();
        }
    }

}
