package com.luckycookie.crewin.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMemberCrew is a Querydsl query type for MemberCrew
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMemberCrew extends EntityPathBase<MemberCrew> {

    private static final long serialVersionUID = -1202551380L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QMemberCrew memberCrew = new QMemberCrew("memberCrew");

    public final NumberPath<Integer> attendanceCount = createNumber("attendanceCount", Integer.class);

    public final QCrew crew;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isInvited = createBoolean("isInvited");

    public final BooleanPath isJoined = createBoolean("isJoined");

    public final QMember member;

    public final EnumPath<com.luckycookie.crewin.domain.enums.Position> position = createEnum("position", com.luckycookie.crewin.domain.enums.Position.class);

    public QMemberCrew(String variable) {
        this(MemberCrew.class, forVariable(variable), INITS);
    }

    public QMemberCrew(Path<? extends MemberCrew> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QMemberCrew(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QMemberCrew(PathMetadata metadata, PathInits inits) {
        this(MemberCrew.class, metadata, inits);
    }

    public QMemberCrew(Class<? extends MemberCrew> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.crew = inits.isInitialized("crew") ? new QCrew(forProperty("crew"), inits.get("crew")) : null;
        this.member = inits.isInitialized("member") ? new QMember(forProperty("member")) : null;
    }

}

