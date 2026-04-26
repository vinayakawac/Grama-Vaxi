package com.example.grama_vaxi.presentation.screens.farmer

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.LocationOn
import androidx.compose.material.icons.rounded.Schedule
import androidx.compose.material.icons.rounded.Vaccines
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.grama_vaxi.domain.model.AlertLevel
import com.example.grama_vaxi.domain.model.HealthAlert
import com.example.grama_vaxi.presentation.components.AlertBanner
import com.example.grama_vaxi.presentation.components.AppDimens
import com.example.grama_vaxi.presentation.components.PrimaryButton
import com.example.grama_vaxi.presentation.components.SecondaryButton

@Composable
fun CampAlertScreen(
    alert: HealthAlert?,
    onMarkRead: () -> Unit
) {
    val safeAlert = alert ?: HealthAlert(
        id = "",
        ownerUid = "all",
        title = "Health Camp Tomorrow",
        message = "A veterinary doctor is arriving to administer vaccines and checkups.",
        level = AlertLevel.URGENT,
        targetVillage = "Palhalli Village",
        campLocation = "Temple Square",
        campTime = "08:00 AM - 02:00 PM"
    )

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(AppDimens.edge),
        verticalArrangement = Arrangement.spacedBy(AppDimens.gutter)
    ) {
        item {
            AlertBanner(
                title = safeAlert.title,
                description = safeAlert.message,
                level = safeAlert.level
            )
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerLow)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(AppDimens.cardPadding),
                    verticalArrangement = Arrangement.spacedBy(AppDimens.unit)
                ) {
                    RowItem(icon = Icons.Rounded.LocationOn, label = "Location", value = safeAlert.campLocation ?: "Temple Square")
                    RowItem(icon = Icons.Rounded.Schedule, label = "Time", value = safeAlert.campTime ?: "08:00 AM - 02:00 PM")
                    RowItem(icon = Icons.Rounded.Vaccines, label = "Services", value = "FMD Boosters, Checkups, Tagging")
                }
            }
        }

        item {
            PrimaryButton(text = "Set Reminder", onClick = onMarkRead)
        }

        item {
            SecondaryButton(text = "View Directions", onClick = {})
        }
    }
}

@Composable
private fun RowItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
        Text(label, style = MaterialTheme.typography.labelMedium)
        Text(value, style = MaterialTheme.typography.bodyLarge)
    }
}
