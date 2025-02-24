package com.PROJECT_9th_TEAM3.WTF;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

import java.io.FileInputStream;
import java.io.InputStream;


public class firebase {
    // Use a service account
    public static Firestore initialize() throws Exception {
        // 서비스 계정 키 파일 경로
        InputStream serviceAccount = new FileInputStream("./firebaseKey.json");

        // GoogleCredentials 생성
        GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);

        // FirebaseOptions 빌더 사용하여 자격 증명 설정
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(credentials)
                .build();

        // FirebaseApp 초기화
        FirebaseApp.initializeApp(options);

        // Firestore 클라이언트 반환
        return FirestoreClient.getFirestore();
    }
}