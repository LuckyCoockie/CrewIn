package com.luckycookie.crewin.domain.enums;

public enum SessionType {
    STANDARD, OPEN, THUNDER, ALL;

    public static SessionType stringToSessionType(String sessionType) {
        if (sessionType.equalsIgnoreCase(STANDARD.toString())) {
            return STANDARD;
        } else if (sessionType.equalsIgnoreCase(OPEN.toString())) {
            return OPEN;
        } else if (sessionType.equalsIgnoreCase(THUNDER.toString())) {
            return THUNDER;
        } else if (sessionType.equalsIgnoreCase(ALL.toString())) {
            return ALL;
        } else {
            return null;
        }
    }
}
