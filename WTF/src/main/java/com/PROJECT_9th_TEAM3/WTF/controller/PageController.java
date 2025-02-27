package com.PROJECT_9th_TEAM3.WTF.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
    // 기본 페이지 요청
    @GetMapping("/")
    public String index() {
        return "index";
    }

    // 회원가입 페이지 요청
    @GetMapping("signup")
    public String signup() {
        return "signup";
    }

    // 로그인 페이지 요청
    @GetMapping("login")
    public String login() {
        return "login";
    }

    @GetMapping("like")
    public String like() {
        return "like";
    }

    @GetMapping("recipe")
    public String recipe() {
        return "recipe";
    }
}
