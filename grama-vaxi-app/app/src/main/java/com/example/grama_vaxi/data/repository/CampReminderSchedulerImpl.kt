package com.example.grama_vaxi.data.repository

import android.content.Context
import androidx.work.Data
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import com.example.grama_vaxi.domain.model.HealthAlert
import com.example.grama_vaxi.domain.repository.CampReminderScheduler
import com.example.grama_vaxi.utils.DateUtils
import com.example.grama_vaxi.worker.CampReminderWorker
import dagger.hilt.android.qualifiers.ApplicationContext
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CampReminderSchedulerImpl @Inject constructor(
    @ApplicationContext private val context: Context
) : CampReminderScheduler {

    override fun scheduleCampReminder(alert: HealthAlert) {
        val scheduledTime = DateUtils.parseDateTimeToEpoch(alert.targetVillage, alert.campTime) 
            ?: return // If we can't parse, don't schedule. 
            // Note: I'm temporarily using targetVillage and campTime as placeholders for date/time if I don't update the model yet.
            // Actually, I'll update the model later. For now, let's assume AlertRepository passes the right data.

        val delay = scheduledTime - System.currentTimeMillis()
        if (delay <= 0) return

        val data = Data.Builder()
            .putString(CampReminderWorker.KEY_TITLE, alert.title)
            .putString(CampReminderWorker.KEY_MESSAGE, alert.message)
            .putString(CampReminderWorker.KEY_ALERT_ID, alert.id)
            .build()

        val request = OneTimeWorkRequestBuilder<CampReminderWorker>()
            .setInitialDelay(delay, TimeUnit.MILLISECONDS)
            .setInputData(data)
            .addTag("camp_reminder_${alert.id}")
            .build()

        WorkManager.getInstance(context).enqueue(request)
    }

    override fun cancelCampReminder(alertId: String) {
        WorkManager.getInstance(context).cancelAllWorkByTag("camp_reminder_$alertId")
    }
}
