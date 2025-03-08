package com.PROJECT_9th_TEAM3.WTF.controller;

import com.PROJECT_9th_TEAM3.WTF.service.MemberService;
import com.PROJECT_9th_TEAM3.WTF.service.RecipeService;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.gson.Gson;
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

    // 레시피 저장
    @PostMapping("/createRecipe")
    public ResponseEntity<Map<String, Object>> createRecipe(@RequestParam("recipeName") String recipeName,
                                                            @RequestParam("step") String recipeStep) {
        Map<String, Object> response = new HashMap<>();

        // UID가 null인지 확인
        if (uid == null || uid.isEmpty()) {
            response.put("success", false);
            response.put("message", "UID가 설정되지 않았습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        // 레시피 이름이 비어있는지 확인
        if (recipeName == null || recipeName.isEmpty()) {
            response.put("success", false);
            response.put("message", "레시피 제목이 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        // 레시피 단계가 비어있는지 확인
        if (recipeStep == null || recipeStep.isEmpty()) {
            response.put("success", false);
            response.put("message", "레시피 단계가 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        recipeStep = recipeStep.replace(",", ". ");

        Map<String, Object> docData = new HashMap<>();
        docData.put("title", recipeName);
        docData.put("content", recipeStep);
        docData.put("liked", false);

        // Firestore에 레시피 저장
        recipeService.createRecipe(docData, uid, recipeName);

        // 레시피 목록 불러오기
        try {
            List<String> recipes = recipeService.getRecipe(uid);
            response.put("success", true);
            response.put("message", "레시피 저장 성공");
            response.put("data", recipes); // 레시피 목록 반환
        } catch (ExecutionException | InterruptedException e) {
            response.put("success", false);
            response.put("message", "레시피 목록을 불러오는 데 실패했습니다.");
        }

        return ResponseEntity.ok(response);
    }


    @GetMapping("/getRecipe")
    public ResponseEntity<Map<String, Object>> getRecipe() throws ExecutionException, InterruptedException {
        Map<String, Object> response = new HashMap<>();

        if (uid == null || uid.isEmpty()) {
            response.put("success", false);
            response.put("message", "UID가 설정되지 않았습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        List<String> recipes = recipeService.getRecipe(uid);
        response.put("success", true);
        response.put("data", recipes);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/showRecipeDetail/{recipeName}")
    public ResponseEntity<Map<String, Object>> showRecipeDetail(@PathVariable String recipeName) throws ExecutionException, InterruptedException {
        Map<String, Object> response = new HashMap<>();

        if (uid == null || uid.isEmpty()) {
            response.put("success", false);
            response.put("message", "UID가 설정되지 않았습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        DocumentSnapshot documentSnapshot = recipeService.showRecipeDetail(uid, recipeName);
        if (documentSnapshot == null || !documentSnapshot.exists()) {
            response.put("success", false);
            response.put("message", "레시피를 찾을 수 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        response.put("success", true);
        response.put("data", documentSnapshot.getData());
        return ResponseEntity.ok(response);
    }

    // 레시피 삭제
    @DeleteMapping("/deleteRecipe/{recipeName}")
    public ResponseEntity<Map<String, String>> deleteRecipe(@PathVariable String recipeName) {
        Map<String, String> response = new HashMap<>();

        if (uid == null || uid.isEmpty()) {
            response.put("success", "false");
            response.put("message", "UID가 설정되지 않았습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        String result = recipeService.deleteRecipe(uid, recipeName);

        if (result.contains("Delete!")) {
            response.put("success", "true");
            response.put("message", "레시피 삭제 성공");
        } else {
            response.put("success", "false");
            response.put("message", "레시피 삭제 실패");
        }
        return ResponseEntity.ok(response);
    }

    // 사용자 이름 설정
    @GetMapping("/api/setUsername")
    public ResponseEntity<String> setUsername() throws ExecutionException, InterruptedException {
        if (uid == null || uid.isEmpty()) {
            return ResponseEntity.badRequest().body("UID가 설정되지 않았습니다.");
        }

        String username = memberService.setUsername(uid);
        return ResponseEntity.ok(username);
    }

    // 클라이언트에서 UID 받기
    @PostMapping("/api/receive-uid")
    public ResponseEntity<String> receiveUID(@RequestBody UIDRequest request) {
        if (request.getUid() == null || request.getUid().isEmpty()) {
            return ResponseEntity.badRequest().body("UID가 비어있습니다.");
        }

        uid = request.getUid();
        return ResponseEntity.ok("UID가 설정되었습니다.");
    }

    static class UIDRequest {
        private String uid;

        public String getUid() {
            return uid;
        }
    }
}
