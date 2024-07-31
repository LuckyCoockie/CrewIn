package com.luckycookie.crewin.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMemberSession is a Querydsl query type for MemberSession
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMemberSession extends EntityPathBase<MemberSession> {

    private static final long serialVersionUID = 69946987L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QMemberSession memberSession = new QMemberSession("memberSession");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isAttend = createBoolean("isAttend");

    public final QMember member;

    public final QSession session;

    public QMemberSession(String variable) {
        this(MemberSession.class, forVariable(variable), INITS);
    }

    public QMemberSession(Path<? extends MemberSession> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QMemberSession(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QMemberSession(PathMetadata metadata, PathInits inits) {
        this(MemberSession.class, metadata, inits);
    }

    public QMemberSession(Class<? extends MemberSession> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new QMember(forProperty("member")) : null;
        this.session = inits.isInitialized("session") ? new QSession(forProperty("session"), inits.get("session")) : null;
    }

}

