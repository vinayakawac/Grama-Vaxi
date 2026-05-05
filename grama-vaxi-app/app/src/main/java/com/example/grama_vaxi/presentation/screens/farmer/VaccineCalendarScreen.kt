package com.example.grama_vaxi.presentation.screens.farmer

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ChevronLeft
import androidx.compose.material.icons.rounded.ChevronRight
import androidx.compose.material.icons.rounded.Vaccines
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.grama_vaxi.presentation.components.AppDimens
import com.example.grama_vaxi.presentation.viewmodel.VaccineCalendarUiState
import com.example.grama_vaxi.utils.DateUtils
import java.time.LocalDate
import java.time.YearMonth
import java.time.format.DateTimeFormatter
import java.util.Locale

@Composable
fun VaccineCalendarScreen(
    uiState: VaccineCalendarUiState
) {
    val displayedMonth = remember { mutableStateOf(YearMonth.now()) }
    val monthTitle = displayedMonth.value.format(DateTimeFormatter.ofPattern("MMMM yyyy", Locale.getDefault()))
    
    // Get scheduled days for the displayed month
    val scheduledDays = uiState.upcomingAnimals
        .map { LocalDate.ofEpochDay(it.nextVaccineEpochDay) }
        .filter { it.year == displayedMonth.value.year && it.monthValue == displayedMonth.value.monthValue }
        .map { it.dayOfMonth }
        .toSet()

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(AppDimens.edge),
        verticalArrangement = Arrangement.spacedBy(AppDimens.gutter)
    ) {
        item {
            Text("Vaccination Calendar", style = MaterialTheme.typography.headlineLarge)
        }

        item {
            Text("Current month", style = MaterialTheme.typography.bodyLarge)
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(monthTitle, style = MaterialTheme.typography.titleLarge)
                Row(horizontalArrangement = Arrangement.spacedBy(AppDimens.unit)) {
                    IconButton(
                        onClick = { displayedMonth.value = displayedMonth.value.minusMonths(1) },
                        modifier = Modifier.size(26.dp)
                    ) {
                        Icon(
                            Icons.Rounded.ChevronLeft,
                            contentDescription = "Previous month",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                    IconButton(
                        onClick = { displayedMonth.value = displayedMonth.value.plusMonths(1) },
                        modifier = Modifier.size(26.dp)
                    ) {
                        Icon(
                            Icons.Rounded.ChevronRight,
                            contentDescription = "Next month",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }
        }

        item {
            Column(verticalArrangement = Arrangement.spacedBy(AppDimens.unit)) {
                val days = (1..displayedMonth.value.lengthOfMonth()).toList().chunked(7)
                days.forEach { week ->
                    Row(horizontalArrangement = Arrangement.spacedBy(AppDimens.unit)) {
                        week.forEach { day ->
                            Surface(
                                color = MaterialTheme.colorScheme.secondaryContainer,
                                shape = CircleShape,
                                modifier = Modifier.size(36.dp)
                            ) {
                                Column(
                                    modifier = Modifier.fillMaxSize(),
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.Center
                                ) {
                                    Text(
                                        day.toString(),
                                        color = MaterialTheme.colorScheme.onSecondaryContainer,
                                        style = MaterialTheme.typography.labelMedium
                                    )
                                    if (scheduledDays.contains(day)) {
                                        Surface(
                                            color = MaterialTheme.colorScheme.primary,
                                            shape = CircleShape,
                                            modifier = Modifier.size(4.dp)
                                        ) {}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        items(uiState.upcomingAnimals) { animal ->
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerLowest),
                shape = androidx.compose.foundation.shape.RoundedCornerShape(AppDimens.radiusLarge)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(AppDimens.gutter),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(AppDimens.gutter)
                ) {
                    Surface(
                        color = MaterialTheme.colorScheme.secondaryContainer,
                        shape = CircleShape,
                        modifier = Modifier.size(44.dp)
                    ) {
                        Icon(
                            Icons.Rounded.Vaccines,
                            contentDescription = null,
                            modifier = Modifier.padding(10.dp),
                            tint = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Text("${animal.name} (${animal.type.name.lowercase().replaceFirstChar { it.uppercase() }})")
                        Text(
                            DateUtils.epochDayToDisplay(animal.nextVaccineEpochDay),
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}
