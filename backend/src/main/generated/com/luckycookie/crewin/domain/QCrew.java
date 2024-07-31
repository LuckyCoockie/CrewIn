package com.luckycookie.crewin.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCrew is a Querydsl query type for Crew
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCrew extends EntityPathBase<Crew> {

    private static final long serialVersionUID = -1775442766L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QCrew crew = new QCrew("crew");

    public final StringPath area = createString("area");

    public final StringPath banner = createString("banner");

    public final QMember captain;

    public final DatePath<java.time.LocalDate> crewBirth = createDate("crewBirth", java.time.LocalDate.class);

    public final StringPath crewName = createString("crewName");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath introduction = createString("introduction");

    public final StringPath mainLogo = createString("mainLogo");

    public final StringPath slogan = createString("slogan");

    public final StringPath subLogo = createString("subLogo");

    public QCrew(String variable) {
        this(Crew.class, forVariable(variable), INITS);
    }

    public QCrew(Path<? extends Crew> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QCrew(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QCrew(PathMetadata metadata, PathInits inits) {
        this(Crew.class, metadata, inits);
    }

    public QCrew(Class<? extends Crew> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.captain = inits.isInitialized("captain") ? new QMember(forProperty("captain")) : null;
    }

}

