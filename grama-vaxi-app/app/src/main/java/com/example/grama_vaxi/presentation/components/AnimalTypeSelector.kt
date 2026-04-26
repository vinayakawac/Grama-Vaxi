package com.example.grama_vaxi.presentation.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Done
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.grama_vaxi.domain.model.AnimalType

@Composable
fun AnimalTypeSelector(
    selectedType: AnimalType,
    onTypeSelected: (AnimalType) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier.fillMaxWidth()) {
        Text("Animal Type", style = MaterialTheme.typography.labelLarge)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = AppDimens.unit),
            horizontalArrangement = Arrangement.spacedBy(AppDimens.unit)
        ) {
            AnimalType.entries.forEach { type ->
                val selected = selectedType == type
                FilterChip(
                    selected = selected,
                    onClick = { onTypeSelected(type) },
                    modifier = Modifier.heightIn(min = AppDimens.minTouch),
                    shape = RoundedCornerShape(AppDimens.radiusMedium),
                    label = { Text(type.name.lowercase().replaceFirstChar { it.uppercase() }) },
                    leadingIcon = if (selected) {
                        {
                            Icon(
                                imageVector = Icons.Rounded.Done,
                                contentDescription = null,
                                modifier = Modifier.padding(end = 2.dp)
                            )
                        }
                    } else {
                        null
                    },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                        selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                )
            }
        }
    }
}
