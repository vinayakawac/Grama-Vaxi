package com.example.grama_vaxi.presentation.screens.farmer

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AddCircle
import androidx.compose.material.icons.rounded.CalendarMonth
import androidx.compose.material.icons.rounded.Campaign
import androidx.compose.material.icons.rounded.CrueltyFree
import androidx.compose.material.icons.rounded.NotificationsActive
import androidx.compose.material.icons.rounded.Warning
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.example.grama_vaxi.domain.model.AlertLevel
import com.example.grama_vaxi.presentation.components.AlertBanner
import com.example.grama_vaxi.presentation.components.AppDimens
import com.example.grama_vaxi.presentation.components.CardStat
import com.example.grama_vaxi.presentation.components.PrimaryButton
import com.example.grama_vaxi.presentation.components.SecondaryButton
import com.example.grama_vaxi.presentation.viewmodel.HomeUiState

@Composable
fun HomeDashboardScreen(
    uiState: HomeUiState,
    onRegisterAnimal: () -> Unit,
    onViewCalendar: () -> Unit,
    onReportDisease: () -> Unit,
    onOpenLedger: () -> Unit,
    onOpenAlerts: () -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(AppDimens.edge),
        verticalArrangement = Arrangement.spacedBy(AppDimens.gutter)
    ) {
        item {
            Column(verticalArrangement = Arrangement.spacedBy(AppDimens.unit)) {
                Text(
                    text = "Namaskara",
                    style = MaterialTheme.typography.headlineLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "Here is your farm's overview today.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        item {
            CardStat(
                title = "Total Animals Registered",
                value = uiState.totalAnimals.toString(),
                subtitle = "animals",
                icon = Icons.Rounded.CrueltyFree,
                containerColor = MaterialTheme.colorScheme.surfaceContainerLowest,
                iconBadgeColor = MaterialTheme.colorScheme.primary,
                valueColor = MaterialTheme.colorScheme.primary,
                onClick = onOpenLedger
            )
        }

        item {
            CardStat(
                title = "Upcoming Vaccinations",
                value = uiState.upcomingVaccinations.toString(),
                subtitle = "scheduled",
                icon = Icons.Rounded.CalendarMonth,
                containerColor = MaterialTheme.colorScheme.secondaryContainer,
                iconBadgeColor = MaterialTheme.colorScheme.onSecondaryContainer,
                valueColor = MaterialTheme.colorScheme.onSecondaryContainer,
                onClick = onViewCalendar
            )
        }

        item {
            CardStat(
                title = "Alerts",
                value = uiState.unreadAlerts.toString(),
                subtitle = "require attention",
                icon = Icons.Rounded.NotificationsActive,
                containerColor = MaterialTheme.colorScheme.errorContainer,
                iconBadgeColor = MaterialTheme.colorScheme.error,
                valueColor = MaterialTheme.colorScheme.error,
                onClick = onOpenAlerts
            )
        }

        item {
            Text(
                text = "Quick Actions",
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.padding(top = AppDimens.unit)
            )
        }

        item {
            PrimaryButton(
                text = "Register Animal",
                onClick = onRegisterAnimal,
                icon = Icons.Rounded.AddCircle
            )
        }

        item {
            SecondaryButton(
                text = "View Calendar",
                onClick = onViewCalendar,
                icon = Icons.Rounded.CalendarMonth
            )
        }

        item {
            SecondaryButton(
                text = "Report Disease",
                onClick = onReportDisease,
                icon = Icons.Rounded.Warning
            )
        }

        if (uiState.highlightedAlerts.isNotEmpty()) {
            item {
                Text(
                    text = "Active Alerts",
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.padding(top = AppDimens.unit)
                )
            }

            items(uiState.highlightedAlerts) { alert ->
                AlertBanner(
                    title = alert.title,
                    description = alert.message,
                    level = alert.level.takeIf { it != AlertLevel.INFO } ?: AlertLevel.INFO,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}
