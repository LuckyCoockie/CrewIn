package com.luckycookie.crewin.exception.notification;

import static com.luckycookie.crewin.exception.constants.NotificationExceptionList.NOT_FOUND_NOTIFICATION_ERROR;

public class NotFoundNotificationException extends NotificationException {
    public NotFoundNotificationException() {
        super(NOT_FOUND_NOTIFICATION_ERROR.getErrorCode(),
                NOT_FOUND_NOTIFICATION_ERROR.getHttpStatus(),
                NOT_FOUND_NOTIFICATION_ERROR.getMessage());
    }
}
