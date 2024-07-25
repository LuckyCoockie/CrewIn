package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.redis.EmailCertification;
import com.luckycookie.crewin.exception.member.EmailNotFoundException;
import com.luckycookie.crewin.exception.member.EmailSendException;
import com.luckycookie.crewin.repository.EmailRedisRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.util.Locale;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender javaMailSender;
    private final EmailRedisRepository emailRedisRepository;
    private final MessageSource messageSource;

    @Value("${spring.mail.username}")
    private String email;

    public void sendAuthenticationMail(String mail) {
        try {
            String randomCode = generateRandomCode();
            MimeMessage mimeMessage = createAuthenticationMessage(mail, randomCode);
            EmailCertification emailCertification = EmailCertification.builder()
                    .email(mail)
                    .certificationNumber(randomCode)
                    .build();
            emailRedisRepository.save(emailCertification);
            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            throw new EmailSendException();
        }
    }

    @Transactional(readOnly = true)
    public boolean checkMail(String email, String code) {
        Optional<EmailCertification> findCode = emailRedisRepository.findById(email);
        if (findCode.isEmpty()) {
            throw new EmailNotFoundException();
        }

        return findCode.get().getCertificationNumber().equals(code);
    }

    public MimeMessage createAuthenticationMessage(String mail, String randomCode) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        message.addRecipients(MimeMessage.RecipientType.TO, mail);
        message.setSubject("CREW-IN 회원가입 인증 메일입니다.", "UTF-8"); // 메일 제목
        message.setText(messageSource.getMessage("spring.mail.authentication", new String[]{randomCode}, Locale.KOREA), "UTF-8", "html"); // 메일 내용
        message.setFrom(new InternetAddress(email, "CrewIn_Official")); //보내는 사람의 메일 주소, 보내는 사람 이름
        return message;
    }

    private String generateRandomCode() {
        int length = 6;
        Random random = new Random();
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            builder.append(random.nextInt(10));
        }
        return builder.toString();
    }
}


