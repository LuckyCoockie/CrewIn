package com.luckycookie.crewin.service;


import com.luckycookie.crewin.exception.validation.ValidationEmailException;
import com.luckycookie.crewin.exception.validation.ValidationInputException;
import com.luckycookie.crewin.exception.validation.ValidationContentException;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class ValidationService {

    private static final String VALID_PATTERN = "^[a-zA-Z0-9가-힣]*$";
    private static final String EMAIL_PATTERN = "^[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,6}$";
    private static final String CONTENT_PATTERN = "^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ.,!?'\"()\\s#-]+$";



    public void validateEmailString(String input) {
        if (!Pattern.matches(EMAIL_PATTERN, input)) {
            throw new ValidationEmailException();
        }
    }

    public void validateNickName(String input) {
        validateLength(input, 10);
        if (!input.matches(VALID_PATTERN)) {
            throw new ValidationInputException();
        }
    }

    public void validateName(String input) {
        validateLength(input, 30);
        if (!input.matches(VALID_PATTERN)) {
            throw new ValidationInputException();
        }
    }

    public void validateContent(String content) {
        if (!Pattern.matches(CONTENT_PATTERN, content)) {
            throw new ValidationContentException();
        }
    }

    public void validateLength(String input, int maxLength) {
        if (input.length() < 2 || input.length() > maxLength) {
            throw new ValidationInputException();
        }
    }

}