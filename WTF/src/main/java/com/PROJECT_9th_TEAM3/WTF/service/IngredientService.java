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
public class IngredientService {

    // 재료 저장
    public void createIngredient(Map<String, Object> docData, String uid) {
        Firestore db = FirestoreClient.getFirestore();

        ApiFuture<DocumentReference> future = db.collection("users").document(uid)
                .collection("ingredients").add(docData);
        try {
            System.out.println("Create! time: " + future.get().getPath());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 재료 불러오기
    public List<Map<String, Object>> getIngredients(String uid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        CollectionReference colRef = db.collection("users").document(uid).collection("ingredients");

        ApiFuture<QuerySnapshot> future = colRef.get();
        QuerySnapshot document = future.get();

        List<Map<String, Object>> ingredients = new ArrayList<>();
        for (QueryDocumentSnapshot doc : document) {
            ingredients.add(doc.getData());
        }

        if (!ingredients.isEmpty()) {
            System.out.println("Get!" + ingredients);
            return ingredients;
        } else {
            System.out.println("No ingredients found!");
        }
        return null;
    }

    // 재료 삭제
    public String deleteIngredient(String uid, String ingredientName) {
        Firestore db = FirestoreClient.getFirestore();

        CollectionReference colRef = db.collection("users").document(uid).collection("ingredients");
        Query query = colRef.whereEqualTo("name", ingredientName);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        try {
            List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();
            if (!documents.isEmpty()) {
                for (QueryDocumentSnapshot document : documents) {
                    document.getReference().delete();
                }
                System.out.println("Delete! " + ingredientName);
                return "Delete! " + ingredientName;
            } else {
                System.out.println("No such ingredient!");
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        return null;
    }
}
