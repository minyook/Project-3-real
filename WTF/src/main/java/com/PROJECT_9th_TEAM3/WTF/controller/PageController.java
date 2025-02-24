package com.PROJECT_9th_TEAM3.WTF.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
    // 기본 페이지 요청
    @GetMapping("/")
    public String index() {
        return "login";
    }

    // 회원가입 페이지 요청
    @GetMapping("signup")
    public String signup() {
        return "signup";
    }
}
