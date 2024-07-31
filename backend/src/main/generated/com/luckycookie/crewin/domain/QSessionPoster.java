package com.luckycookie.crewin.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSessionPoster is a Querydsl query type for SessionPoster
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSessionPoster extends EntityPathBase<SessionPoster> {

    private static final long serialVersionUID = -618486958L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSessionPoster sessionPoster = new QSessionPoster("sessionPoster");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath imageUrl = createString("imageUrl");

    public final QSession session;

    public QSessionPoster(String variable) {
        this(SessionPoster.class, forVariable(variable), INITS);
    }

    public QSessionPoster(Path<? extends SessionPoster> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSessionPoster(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSessionPoster(PathMetadata metadata, PathInits inits) {
        this(SessionPoster.class, metadata, inits);
    }

    public QSessionPoster(Class<? extends SessionPoster> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.session = inits.isInitialized("session") ? new QSession(forProperty("session"), inits.get("session")) : null;
    }

}

