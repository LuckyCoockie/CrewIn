package com.luckycookie.crewin.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QMember is a Querydsl query type for Member
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMember extends EntityPathBase<Member> {

    private static final long serialVersionUID = -823974485L;

    public static final QMember member = new QMember("member1");

    public final StringPath email = createString("email");

    public final BooleanPath existNotification = createBoolean("existNotification");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath imageUrl = createString("imageUrl");

    public final StringPath name = createString("name");

    public final StringPath nickname = createString("nickname");

    public final StringPath password = createString("password");

    public final EnumPath<com.luckycookie.crewin.domain.enums.Role> role = createEnum("role", com.luckycookie.crewin.domain.enums.Role.class);

    public final NumberPath<Integer> totalAttendance = createNumber("totalAttendance", Integer.class);

    public final NumberPath<Integer> totalDistance = createNumber("totalDistance", Integer.class);

    public final NumberPath<Integer> totalTime = createNumber("totalTime", Integer.class);

    public QMember(String variable) {
        super(Member.class, forVariable(variable));
    }

    public QMember(Path<? extends Member> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMember(PathMetadata metadata) {
        super(Member.class, metadata);
    }

}

