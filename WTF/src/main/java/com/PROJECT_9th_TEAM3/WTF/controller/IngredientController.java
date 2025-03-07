package com.PROJECT_9th_TEAM3.WTF.controller;

import com.PROJECT_9th_TEAM3.WTF.service.IngredientService;
import com.PROJECT_9th_TEAM3.WTF.service.MemberService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date; // 이 부분 추가
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
public class IngredientController {
    @Autowired
    public IngredientService ingredientService;

    @Autowired
    public MemberService memberService;
    public String uid;

    @PostMapping("/createIngredient")
    public String createIngredient(@RequestBody Map<String, String> requestData) {
        String ingredientName = requestData.get("ingredientName");
        String userId = requestData.get("uid");

        Map<String, Object> docData = new HashMap<>();
        docData.put("name", ingredientName);
        docData.put("createdAt", new Date().toString());

        ingredientService.createIngredient(docData, userId);

        return "Ingredient created successfully";
    }

    @GetMapping("/getIngredients")
    public List<Map<String, Object>> getIngredients() throws ExecutionException, InterruptedException {
        return ingredientService.getIngredients(uid);
    }

    @DeleteMapping("/deleteIngredient/{ingredientName}")
    public Map<String, String> deleteIngredient(@PathVariable String ingredientName) {
        Map<String, String> response = new HashMap<>();

        String success = ingredientService.deleteIngredient(uid, ingredientName);

        if (success.contains("Delete!")) {
            response.put("success", "true");
        } else {
            response.put("success", "false");
        }
        return response;
    }

    // 사용자 이름 셋팅
    @GetMapping("/api/ingredient/setUsername")
    public ResponseEntity<String> setUsername() throws ExecutionException, InterruptedException {
        String username = memberService.setUsername(uid);
        return ResponseEntity.ok(username);
    }

    // uid를 가져오기위한 함수
    @PostMapping("/api/ingredient/receive-uid")
    public void receiveUID(@RequestBody UIDRequest request) {
        uid = request.getUid();
    }

    static class UIDRequest {
        private String uid;
        public String getUid() { return uid; }
    }
}
