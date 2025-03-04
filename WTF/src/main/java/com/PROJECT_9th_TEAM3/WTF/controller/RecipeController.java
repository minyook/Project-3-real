package com.PROJECT_9th_TEAM3.WTF.controller;

import com.PROJECT_9th_TEAM3.WTF.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
public class RecipeController {
    @Autowired
    public RecipeService recipeService;
    private String uid;

    @PostMapping("/createRecipe")
    public String createRecipe(@RequestParam("recipeName") String recipeName,
                             @RequestParam("step") String recipeStep)  throws InterruptedException, ExecutionException {

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

    // uid를 가져오기위한 함수
    @PostMapping("/api/receive-uid")
    public void receiveUID(@RequestBody UIDRequest request) {
        uid = request.getUid();
        System.out.println("Received UID: " + uid);
    }

    static class UIDRequest {
        private String uid;
        public String getUid() { return uid; }
    }
}
