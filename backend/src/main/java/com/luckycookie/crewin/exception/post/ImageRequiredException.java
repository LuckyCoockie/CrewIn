package com.luckycookie.crewin.exception.post;

import static com.luckycookie.crewin.exception.constants.PostExceptionList.IMAGE_REQUIRED_ERROR;

public class ImageRequiredException extends PostException{
    public ImageRequiredException() {
        super(IMAGE_REQUIRED_ERROR.getErrorCode(),
                IMAGE_REQUIRED_ERROR.getHttpStatus(),
                IMAGE_REQUIRED_ERROR.getMessage());
    }
}
