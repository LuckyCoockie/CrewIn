package com.luckycookie.crewin.domain.enums;

import com.luckycookie.crewin.exception.session.NotFoundSessionTypeException;
import org.apache.commons.lang3.StringUtils;

public enum SessionType {
    STANDARD, OPEN, THUNDER, ALL;

    public static SessionType stringToSessionType(String sessionType) {
        if (sessionType.isEmpty())
            return ALL;

        if (StringUtils.equalsIgnoreCase(sessionType, STANDARD.toString())) {
            return STANDARD;
        } else if (sessionType.equalsIgnoreCase(OPEN.toString())) {
            return OPEN;
        } else if (sessionType.equalsIgnoreCase(THUNDER.toString())) {
            return THUNDER;
        } else {
            throw new NotFoundSessionTypeException();
        }
    }
}
