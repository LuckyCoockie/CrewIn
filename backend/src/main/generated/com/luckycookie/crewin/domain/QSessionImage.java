package com.luckycookie.crewin.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSessionImage is a Querydsl query type for SessionImage
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSessionImage extends EntityPathBase<SessionImage> {

    private static final long serialVersionUID = -165040458L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSessionImage sessionImage = new QSessionImage("sessionImage");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath imageUrl = createString("imageUrl");

    public final QSession session;

    public QSessionImage(String variable) {
        this(SessionImage.class, forVariable(variable), INITS);
    }

    public QSessionImage(Path<? extends SessionImage> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSessionImage(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSessionImage(PathMetadata metadata, PathInits inits) {
        this(SessionImage.class, metadata, inits);
    }

    public QSessionImage(Class<? extends SessionImage> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.session = inits.isInitialized("session") ? new QSession(forProperty("session"), inits.get("session")) : null;
    }

}

