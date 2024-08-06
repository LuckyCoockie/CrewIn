package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.QSession;
import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.domain.enums.SessionType;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static com.luckycookie.crewin.domain.enums.SessionType.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class SessionQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;
    private final QSession session = QSession.session;

    public List<Session> findSessionsByStatusAndTypeAndCrewNameAndDate(String status, SessionType sessionType, String crewName, LocalDate date) {
        return jpaQueryFactory
                .select(session)
                .from(session)
                .where(statusEq(status), typeEq(sessionType), crewNameEq(crewName), dateEq(date))
                .orderBy(session.id.desc())
                .fetch();
    }

    private BooleanExpression dateEq(LocalDate date) {
        if (date == null) return null;
        else
            return session.startAt.year().eq(date.getYear())
                    .and(session.startAt.month().eq(date.getMonthValue()))
                    .and(session.startAt.dayOfMonth().eq(date.getDayOfMonth()));
    }

    private BooleanExpression crewNameEq(String crewName) {
        if (crewName.isEmpty())
            return null;
        else
            return
                    session.crew.crewName.contains(crewName);
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

