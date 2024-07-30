package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Notification;
import com.luckycookie.crewin.domain.enums.NotificationType;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final MemberRepository memberRepository;
    private final NotificationRepository notificationRepository;

    public void createNotification(NotificationType notificationType, Long senderId, Long receiverId) {
        Member receiver = memberRepository.findById(receiverId)
                .orElseThrow(NotFoundMemberException::new);

        notificationRepository.save(
                Notification
                        .builder()
                        .isChecked(Boolean.FALSE)
                        .notificationType(notificationType)
                        .senderId(senderId)
                        .receiver(receiver)
                        .build());

        receiver.updateMemberNotification(true);
        memberRepository.save(receiver);

    }
}
