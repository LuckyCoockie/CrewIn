package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.QSession;
import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.domain.enums.SessionType;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

import static com.luckycookie.crewin.domain.enums.SessionType.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class SessionQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;
    private final QSession session = QSession.session;

    public List<Session> findSessionsByStatusAndType(String status, SessionType sessionType) {
        return jpaQueryFactory
                .select(session)
                .from(session)
                .where(statusEq(status), typeEq(sessionType))
                .orderBy(session.id.desc())
                .fetch();
    }

    private BooleanExpression statusEq(String status) {
        if (status.equalsIgnoreCase("active"))
            return session.startAt.after(LocalDateTime.now());
        else
            return null;
    }

    private BooleanExpression typeEq(SessionType type) {
        switch (type) {
            case STANDARD -> {
                return session.sessionType.eq(STANDARD);
            }
            case OPEN -> {
                return session.sessionType.eq(OPEN);
            }
            case THUNDER -> {
                return session.sessionType.eq(THUNDER);
            }
            default -> {
                return null;
            }
        }
    }
}

