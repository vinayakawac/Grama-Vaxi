package com.example.grama_vaxi.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.example.grama_vaxi.MainActivity
import com.example.grama_vaxi.R
import com.example.grama_vaxi.data.remote.notifications.NotificationTokenSyncManager
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import javax.inject.Inject

@AndroidEntryPoint
class GramaVaxiMessagingService : FirebaseMessagingService() {

    @Inject
    lateinit var tokenSyncManager: NotificationTokenSyncManager

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        serviceScope.launch {
            tokenSyncManager.syncCurrentToken(forceToken = token)
        }
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        ensureCampAlertChannel()

        val notification = message.notification
        val title = notification?.title ?: "Camp Alert - Grama-Vaxi"
        val body = notification?.body ?: "New update from veterinary officer"

        val launchIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            this,
            1001,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(this, CAMP_ALERT_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)

        NotificationManagerCompat.from(this).notify(
            (System.currentTimeMillis() % Int.MAX_VALUE).toInt(),
            builder.build()
        )
    }

    private fun ensureCampAlertChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val existing = manager.getNotificationChannel(CAMP_ALERT_CHANNEL_ID)
        if (existing != null) return

        val channel = NotificationChannel(
            CAMP_ALERT_CHANNEL_ID,
            "Camp Alerts",
            NotificationManager.IMPORTANCE_HIGH
        ).apply {
            description = "Vaccination camp announcements"
        }

        manager.createNotificationChannel(channel)
    }

    companion object {
        const val CAMP_ALERT_CHANNEL_ID = "camp_alerts"
    }
}
