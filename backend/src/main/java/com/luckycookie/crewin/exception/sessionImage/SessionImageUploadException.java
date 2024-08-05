package com.luckycookie.crewin.exception.sessionImage;


import static com.luckycookie.crewin.exception.constants.SessionImageExceptionList.SESSION_IMAGE_UPLOAD_ERROR;

public class SessionImageUploadException extends SessionImageException{
    public SessionImageUploadException() {
        super(SESSION_IMAGE_UPLOAD_ERROR.getErrorCode(),
                SESSION_IMAGE_UPLOAD_ERROR.getHttpStatus(),
                SESSION_IMAGE_UPLOAD_ERROR.getMessage());
    }
}
