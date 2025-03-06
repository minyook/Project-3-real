package com.PROJECT_9th_TEAM3.WTF.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class MemberService {
    public String setUsername(String uid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        DocumentReference docRef = db.collection("users").document(uid);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        String username = document.getString("name");
        if (document.exists()) {
            return username;
        } else {
            System.out.println("No such document!");
        }
        return null;
    }
}
