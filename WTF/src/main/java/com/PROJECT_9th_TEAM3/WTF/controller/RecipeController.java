package com.PROJECT_9th_TEAM3.WTF.controller;

import com.PROJECT_9th_TEAM3.WTF.service.MemberService;
import com.PROJECT_9th_TEAM3.WTF.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
public class RecipeController {
    @Autowired
    public RecipeService recipeService;

    @Autowired
    public MemberService memberService;
    public String uid;

    @PostMapping("/createRecipe")
    public String createRecipe(@RequestParam("recipeName") String recipeName,
                             @RequestParam("step") String recipeStep) {

        String[] steps = recipeStep.split(",");
        int count = 1;

        Map<String, Object> docData = new HashMap<>();
        for(String step : steps) {
            docData.put("step" + count, step);
            count++;
        }
        docData.put("like", "off");

        recipeService.createRecipe(docData, uid, recipeName);

        return null;
    }

    @GetMapping("/getRecipe")
    public List<String> getRecipe() throws ExecutionException, InterruptedException {
        return recipeService.getRecipe(uid);
    }

    @DeleteMapping("/deleteRecipe/{recipeName}")
    public Map<String, String> deleteRecipe(@PathVariable String recipeName) {
        Map<String, String> response = new HashMap<>();

        String success = recipeService.deleteRecipe(uid, recipeName);

        if (success.contains("Delete!")) {
            response.put("success", "true");
        } else {
            response.put("success", "false");
        }
        return response;
    }

    // 사용자 이름 셋팅
    @GetMapping("/api/setUsername")
    public ResponseEntity<String> setUsername() throws ExecutionException, InterruptedException {
        String username = memberService.setUsername(uid);
        return ResponseEntity.ok(username);
    }

    // uid를 가져오기위한 함수
    @PostMapping("/api/receive-uid")
    public void receiveUID(@RequestBody UIDRequest request) {
        uid = request.getUid();
    }

    static class UIDRequest {
        private String uid;
        public String getUid() { return uid; }
    }
}
