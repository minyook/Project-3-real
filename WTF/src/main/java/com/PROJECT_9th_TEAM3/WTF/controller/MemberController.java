package com.PROJECT_9th_TEAM3.WTF.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class MemberController {
    @PostMapping("signup")
    public String signup(@RequestParam("memberName") String memberName,
                         @RequestParam("memberEmail") String memberEmail,
                         @RequestParam("memberPassword") String memberPassword) {

        System.out.println("memberName = " + memberName + ", memberEmail = " + memberEmail + ", memberPassword = " + memberPassword);
        System.out.println("MemberController.signup");
        return null;
    }

    @PostMapping("login")
    public String login(@RequestParam("memberEmail") String memberEmail,
                        @RequestParam("memberPassword") String memberPassword) {

        System.out.println("memberEmail = " + memberEmail + ", memberPassword = " + memberPassword);
        return null;
    }
}
