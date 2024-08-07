package com.luckycookie.crewin.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSession is a Querydsl query type for Session
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSession extends EntityPathBase<Session> {

    private static final long serialVersionUID = 1262700965L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSession session = new QSession("session");

    public final StringPath area = createString("area");

    public final DateTimePath<java.time.LocalDateTime> attendanceStart = createDateTime("attendanceStart", java.time.LocalDateTime.class);

    public final StringPath content = createString("content");

    public final QCourse course;

    public final QCrew crew;

    public final DateTimePath<java.time.LocalDateTime> endAt = createDateTime("endAt", java.time.LocalDateTime.class);

    public final QMember host;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Double> lat = createNumber("lat", Double.class);

    public final NumberPath<Double> lng = createNumber("lng", Double.class);

    public final NumberPath<Integer> maxPeople = createNumber("maxPeople", Integer.class);

    public final StringPath name = createString("name");

    public final NumberPath<Integer> pace = createNumber("pace", Integer.class);

    public final ListPath<SessionPoster, QSessionPoster> posterImages = this.<SessionPoster, QSessionPoster>createList("posterImages", SessionPoster.class, QSessionPoster.class, PathInits.DIRECT2);

    public final EnumPath<com.luckycookie.crewin.domain.enums.SessionType> sessionType = createEnum("sessionType", com.luckycookie.crewin.domain.enums.SessionType.class);

    public final StringPath spot = createString("spot");

    public final DateTimePath<java.time.LocalDateTime> startAt = createDateTime("startAt", java.time.LocalDateTime.class);

    public QSession(String variable) {
        this(Session.class, forVariable(variable), INITS);
    }

    public QSession(Path<? extends Session> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSession(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSession(PathMetadata metadata, PathInits inits) {
        this(Session.class, metadata, inits);
    }

    public QSession(Class<? extends Session> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.course = inits.isInitialized("course") ? new QCourse(forProperty("course"), inits.get("course")) : null;
        this.crew = inits.isInitialized("crew") ? new QCrew(forProperty("crew"), inits.get("crew")) : null;
        this.host = inits.isInitialized("host") ? new QMember(forProperty("host")) : null;
    }

}

