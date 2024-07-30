package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Notification;
import com.luckycookie.crewin.domain.enums.NotificationType;
import com.luckycookie.crewin.dto.NotificationResponse;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
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

        List<Notification> notificationList = notificationRepository.findByReceiver(member);

        return notificationList.stream()
                .map(notification -> NotificationResponse.builder()
                        .isChecked(notification.getIsChecked())
                        .notificationType(notification.getNotificationType())
                        .postId(notification.getPostId())
                        .senderId(notification.getSenderId())
                        .createdAt(notification.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

}
