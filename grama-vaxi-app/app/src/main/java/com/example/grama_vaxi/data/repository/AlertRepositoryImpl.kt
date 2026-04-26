package com.example.grama_vaxi.data.repository

import com.example.grama_vaxi.data.local.dao.AlertDao
import com.example.grama_vaxi.data.local.dao.SyncQueueDao
import com.example.grama_vaxi.data.local.entity.SyncQueueEntity
import com.example.grama_vaxi.data.local.mapper.toDomain
import com.example.grama_vaxi.data.local.mapper.toEntity
import com.example.grama_vaxi.domain.model.HealthAlert
import com.example.grama_vaxi.domain.repository.AlertRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AlertRepositoryImpl @Inject constructor(
    private val alertDao: AlertDao,
    private val syncQueueDao: SyncQueueDao
) : AlertRepository {

    override fun observeAlerts(ownerUid: String): Flow<List<HealthAlert>> =
        alertDao.observeAlerts(ownerUid).map { entities -> entities.map { it.toDomain() } }

    override suspend fun createCampAlert(targetVillage: String, alert: HealthAlert): Result<Unit> = runCatching {
        withContext(Dispatchers.IO) {
            val local = alert.copy(
                targetVillage = targetVillage,
                ownerUid = "all",
                synced = false,
                createdAt = System.currentTimeMillis()
            )
            alertDao.upsert(local.toEntity())
            syncQueueDao.enqueue(
                SyncQueueEntity(
                    id = UUID.randomUUID().toString(),
                    payloadType = SyncPayloadType.ALERT,
                    payloadId = local.id,
                    action = SyncAction.UPSERT,
                    createdAt = System.currentTimeMillis()
                )
            )
        }
    }

    override suspend fun markAlertRead(alertId: String): Result<Unit> = runCatching {
        withContext(Dispatchers.IO) {
            alertDao.markRead(alertId)
            syncQueueDao.enqueue(
                SyncQueueEntity(
                    id = UUID.randomUUID().toString(),
                    payloadType = SyncPayloadType.ALERT,
                    payloadId = alertId,
                    action = SyncAction.UPSERT,
                    createdAt = System.currentTimeMillis()
                )
            )
        }
    }
}
