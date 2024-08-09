package com.luckycookie.crewin.repository;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class EmitterRepository {
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter save(Long emitterId, SseEmitter sseEmitter) { // emitter를 저장
        emitters.put(emitterId, sseEmitter);
        return sseEmitter;
    }

    public void deleteById(Long id) { // emitter를 지움
        emitters.remove(id);
    }

    public SseEmitter findById(Long id) { // 해당 회원과 관련된 모든 이벤트를 찾음
        return emitters.get(id);
    }
}
