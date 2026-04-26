package com.example.grama_vaxi.presentation.screens.farmer

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Done
import androidx.compose.material.icons.rounded.Notifications
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.example.grama_vaxi.presentation.components.AlertBanner
import com.example.grama_vaxi.presentation.components.AppDimens
import com.example.grama_vaxi.presentation.viewmodel.NotificationsUiState

@Composable
fun NotificationsScreen(
    uiState: NotificationsUiState,
    onMarkRead: (String) -> Unit,
    onOpenAlert: (String) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(AppDimens.edge),
        verticalArrangement = Arrangement.spacedBy(AppDimens.gutter)
    ) {
        item {
            Text("Active Alerts", style = MaterialTheme.typography.headlineLarge)
            Text(
                "Critical updates for your livestock.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        uiState.alerts.firstOrNull { !it.isRead }?.let { top ->
            item {
                AlertBanner(
                    title = top.title,
                    description = top.message,
                    level = top.level
                )
            }
        }

        items(uiState.alerts) { alert ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onOpenAlert(alert.id) },
                colors = CardDefaults.cardColors(
                    containerColor = if (alert.isRead) {
                        MaterialTheme.colorScheme.surfaceContainer
                    } else {
                        MaterialTheme.colorScheme.surfaceContainerLow
                    }
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(AppDimens.cardPadding),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(AppDimens.unit)
                    ) {
                        Text(alert.title, style = MaterialTheme.typography.titleSmall)
                        Text(alert.message, style = MaterialTheme.typography.bodyMedium)
                    }

                    Icon(
                        imageVector = if (alert.isRead) Icons.Rounded.Done else Icons.Rounded.Notifications,
                        contentDescription = "Mark Read",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier
                            .padding(start = AppDimens.unit)
                            .clickable { onMarkRead(alert.id) }
                    )
                }
            }
        }
    }
}
