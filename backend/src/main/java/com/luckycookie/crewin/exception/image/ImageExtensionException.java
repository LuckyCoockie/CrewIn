package com.luckycookie.crewin.exception.image;

import static com.luckycookie.crewin.exception.constants.ImageExceptionList.IMAGE_EXTENSION_ERROR;

public class ImageExtensionException extends ImageException{
    public ImageExtensionException(){
        super(IMAGE_EXTENSION_ERROR.getErrorCode(),
                IMAGE_EXTENSION_ERROR.getHttpStatus(),
                IMAGE_EXTENSION_ERROR.getMessage());
    }
}
