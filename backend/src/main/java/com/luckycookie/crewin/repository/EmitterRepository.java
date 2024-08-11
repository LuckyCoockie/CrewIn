package com.luckycookie.crewin.repository;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class EmitterRepository {
    // Map<SessionId, Map<MemberSessionId, SseEmitter>>
    private final Map<Long, Map<Long, SseEmitter>> emitters = new ConcurrentHashMap<>();

    public SseEmitter save(Long sessionId, Long memberSessionId, SseEmitter sseEmitter) { // emitter를 저장
        emitters.get(sessionId).put(memberSessionId, sseEmitter);
        return sseEmitter;
    }

    public void deleteById(Long sessionId, Long memberSessionId) { // emitter를 지움
        emitters.get(sessionId).remove(memberSessionId);
    }

    public List<SseEmitter> findEmittersBySessionId(Long sessionId) { // 해당 회원과 관련된 모든 이벤트를 찾음
        return new ArrayList<>(emitters.get(sessionId).values());
    }
}
