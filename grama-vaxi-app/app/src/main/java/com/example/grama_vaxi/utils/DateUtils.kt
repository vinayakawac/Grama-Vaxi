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
}
