package com.example.grama_vaxi.utils

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit

object DateUtils {

    fun currentEpochDayUtc(): Long = TimeUnit.MILLISECONDS.toDays(System.currentTimeMillis())

    fun epochDayToDisplay(epochDay: Long): String {
        if (epochDay <= 0) return "---"
        val millis = TimeUnit.DAYS.toMillis(epochDay)
        return SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).format(Date(millis))
    }

    fun parseDateTimeToEpoch(date: String?, time: String?): Long? {
        if (date == null || time == null) return null
        return try {
            val format = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault())
            format.parse("$date $time")?.time
        } catch (e: Exception) {
            null
        }
    }
}
