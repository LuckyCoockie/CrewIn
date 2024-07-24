package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.redis.EmailCertification;
import com.luckycookie.crewin.exception.member.EmailSendException;
import com.luckycookie.crewin.repository.EmailRedisRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender javaMailSender;
    private final EmailRedisRepository emailRedisRepository;

    @Value("${spring.mail.username}")
    private String email;

    private final String content = "<!DOCTYPE html>\n" +
            "<html lang=\"ko\">\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
            "    <title>이메일 인증 코드</title>\n" +
            "</head>\n" +
            "<body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;\">\n" +
            "    <div style=\"background-color: #f9f9f9; border-radius: 5px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);\">\n" +
            "        <h1 style=\"color: #2c3e50; text-align: center;\">이메일 인증 코드</h1>\n" +
            "        <p>안녕하세요,</p>\n" +
            "        <p>귀하의 계정 인증을 위한 인증 코드입니다.</p>\n" +
            "        <div style=\"background-color: #2B2F40; color: white; font-size: 24px; font-weight: bold; text-align: center; padding: 10px; margin: 20px 0; border-radius: 5px;\">RandomCode</div>\n" +
            "        <p>이 코드는 5분 동안 유효합니다. 해당 코드를 인증 코드 확인란에 입력해주세요.</p>\n" +
            "        <p>감사합니다.</p>\n" +
            "    </div>\n" +
            "    <div style=\"text-align: center; font-size: 12px; color: #7f8c8d; margin-top: 20px;\">\n" +
            "        <p>본 이메일은 발신 전용입니다. 문의사항이 있으시면 고객센터로 연락해 주세요.</p>\n" +
            "        <p>&copy; 2024 CREW-IN. All rights reserved.</p>\n" +
            "    </div>\n" +
            "</body>\n" +
            "</html>";

    @Transactional(readOnly = true)
    public void sendMail(String mail) {
        try {
            String randomCode = generateRandomCode();
            MimeMessage mimeMessage = createMessage(mail, randomCode);
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

    public MimeMessage createMessage(String mail, String randomCode) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        message.addRecipients(MimeMessage.RecipientType.TO, mail);
        message.setSubject("CREW-IN 회원가입 인증 메일입니다."); // 메일 제목
        message.setText(content.replace("RandomCode", randomCode), "UTF-8", "html"); // 메일 내용
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


