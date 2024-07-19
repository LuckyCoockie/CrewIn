//package com.luckycookie.crewin.security;
//
//import com.luckycookie.crewin.repository.MemberRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Service
//@RequiredArgsConstructor
//public class CustomUserDetailsService implements UserDetailsService {
//
//    private final MemberRepository memberRepository;
//
//    @Override
//    @Transactional(readOnly = true)
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        return memberRepository.findByEmail(email)
//                .map()
//    }
//}
