package com.example.grama_vaxi.data.remote

import android.content.Context
import com.example.grama_vaxi.domain.model.DiseaseReport
import com.example.grama_vaxi.domain.model.HealthAlert
import com.example.grama_vaxi.domain.model.Animal
import com.google.firebase.FirebaseApp
import com.google.firebase.firestore.FirebaseFirestore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FirebaseRemoteDataSource @Inject constructor(
    @ApplicationContext private val context: Context
) {

    private fun firestoreOrNull(): FirebaseFirestore? {
        val configured = runCatching { FirebaseApp.getApps(context).isNotEmpty() }.getOrDefault(false)
        if (!configured) return null
        return runCatching { FirebaseFirestore.getInstance() }.getOrNull()
    }

    suspend fun upsertAnimal(animal: Animal): Result<Unit> = runCatching {
        val firestore = firestoreOrNull() ?: error("Firebase not configured")
        val payload = hashMapOf(
            "ownerUid" to animal.ownerUid,
            "tagId" to animal.tagId,
            "name" to animal.name,
            "type" to animal.type.name,
            "breed" to animal.breed,
            "ageMonths" to animal.ageMonths,
            "village" to animal.village,
            "photoUri" to animal.photoUri,
            "nextVaccineEpochDay" to animal.nextVaccineEpochDay,
            "updatedAt" to animal.updatedAt
        )

        firestore.collection("users")
            .document(animal.ownerUid)
            .collection("animals")
            .document(animal.id)
            .set(payload)
            .await()
    }

    suspend fun deleteAnimal(ownerUid: String, animalId: String): Result<Unit> = runCatching {
        val firestore = firestoreOrNull() ?: error("Firebase not configured")
        firestore.collection("users")
            .document(ownerUid)
            .collection("animals")
            .document(animalId)
            .delete()
            .await()
    }

    suspend fun upsertReport(report: DiseaseReport): Result<Unit> = runCatching {
        val firestore = firestoreOrNull() ?: error("Firebase not configured")
        val payload = hashMapOf(
            "animalId" to report.animalId,
            "symptoms" to report.symptoms,
            "affectedCount" to report.affectedCount,
            "notes" to report.notes,
            "status" to report.status.name,
            "createdAt" to report.createdAt
        )
        firestore.collection("users")
            .document(report.ownerUid)
            .collection("reports")
            .document(report.id)
            .set(payload)
            .await()
    }

    suspend fun markReportReviewed(ownerUid: String, reportId: String): Result<Unit> = runCatching {
        val firestore = firestoreOrNull() ?: error("Firebase not configured")
        firestore.collection("users")
            .document(ownerUid)
            .collection("reports")
            .document(reportId)
            .update("status", "REVIEWED")
            .await()
    }

    suspend fun upsertAlert(alert: HealthAlert): Result<Unit> = runCatching {
        val firestore = firestoreOrNull() ?: error("Firebase not configured")
        val payload = hashMapOf(
            "ownerUid" to alert.ownerUid,
            "title" to alert.title,
            "message" to alert.message,
            "level" to alert.level.name,
            "createdAt" to alert.createdAt,
            "isRead" to alert.isRead,
            "campLocation" to alert.campLocation,
            "campTime" to alert.campTime,
            "targetVillage" to alert.targetVillage
        )
        firestore.collection("alerts")
            .document(alert.id)
            .set(payload)
            .await()
    }

    suspend fun markAlertRead(alertId: String): Result<Unit> = runCatching {
        val firestore = firestoreOrNull() ?: error("Firebase not configured")
        firestore.collection("alerts")
            .document(alertId)
            .update("isRead", true)
            .await()
    }
}
