package com.luckycookie.crewin.exception.notification;

import static com.luckycookie.crewin.exception.constants.NotificationExceptionList.NOT_MATCH_MEMBER_NOTIFICATION_ERROR;

public class NotMatchMemberNotificationError extends NotificationException{
    public NotMatchMemberNotificationError() {
        super(NOT_MATCH_MEMBER_NOTIFICATION_ERROR.getErrorCode(),
                NOT_MATCH_MEMBER_NOTIFICATION_ERROR.getHttpStatus(),
                NOT_MATCH_MEMBER_NOTIFICATION_ERROR.getMessage());
    }
}
