package com.PROJECT_9th_TEAM3.WTF.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class RecipeService {

    // 레시피 저장
    public void createRecipe(Map<String, Object> docData, String uid, String recipeName) {
        Firestore db = FirestoreClient.getFirestore();

        ApiFuture<WriteResult> future = db.collection("users").document(uid)
                .collection("recipes").document(recipeName).set(docData);
        try {
            System.out.println("Create! time: " + future.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

    // 레시피 불러오기
    public List<String> getRecipe(String uid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        CollectionReference colRef = db.collection("users").document(uid).collection("recipes");

        ApiFuture<QuerySnapshot> future = colRef.get();
        QuerySnapshot document = future.get();

        List<String> recipes = new ArrayList<>();
        for (QueryDocumentSnapshot doc : document) {
            recipes.add(doc.getId());
        }

        if (!recipes.isEmpty()) {
            System.out.println("Get!" + recipes);
            return recipes;
        } else {
            System.out.println("No recipes found!");
        }
        return null;
    }

    // 레시피 삭제
    public String deleteRecipe(String uid,
                               String recipeName) {
        Firestore db = FirestoreClient.getFirestore();

        db.collection("users").document(uid).collection("recipes").document(recipeName).delete();

        System.out.println("Delete! " + recipeName);
        return "Delete! " + recipeName;
    }

    // 상세정보 보기
    public DocumentSnapshot showRecipeDetail(String uid,
                                             String recipeName) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        DocumentReference docRef = db.collection("users").document(uid).collection("recipes").document(recipeName);

        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            return document;
        } else {
            System.out.println("No such document!");
        }
        return null;
    }
}
