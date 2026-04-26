package com.example.grama_vaxi.presentation.screens.farmer

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Warning
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.example.grama_vaxi.domain.model.Animal
import com.example.grama_vaxi.presentation.components.AppDimens
import com.example.grama_vaxi.presentation.components.PrimaryButton
import com.example.grama_vaxi.presentation.components.StepperInput
import com.example.grama_vaxi.presentation.viewmodel.DiseaseReportUiState

@Composable
fun DiseaseReportScreen(
    uiState: DiseaseReportUiState,
    onAnimalSelected: (String) -> Unit,
    onSymptomsChanged: (String) -> Unit,
    onNotesChanged: (String) -> Unit,
    onAffectedCountChanged: (Int) -> Unit,
    onClassifySymptoms: () -> Unit,
    onSubmit: () -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(AppDimens.edge),
        verticalArrangement = Arrangement.spacedBy(AppDimens.gutter)
    ) {
        item {
            Text("Report Disease", style = MaterialTheme.typography.headlineLarge)
            Text(
                "Alert local veterinary services immediately.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        item {
            Text("Select Affected Animal(s)", style = MaterialTheme.typography.labelLarge)
        }

        items(uiState.animals) { animal ->
            AnimalChip(
                animal = animal,
                selected = uiState.selectedAnimalId == animal.id,
                onClick = { onAnimalSelected(animal.id) }
            )
        }

        item {
            StepperInput(
                value = uiState.affectedCount,
                onValueChange = onAffectedCountChanged,
                label = "Number of Affected Animals"
            )
        }

        item {
            OutlinedTextField(
                value = uiState.symptoms,
                onValueChange = onSymptomsChanged,
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Symptoms Observed") },
                placeholder = { Text("Describe symptoms clearly...") },
                minLines = 4,
                maxLines = 6
            )
        }

        item {
            OutlinedTextField(
                value = uiState.notes,
                onValueChange = onNotesChanged,
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Additional Notes") },
                placeholder = { Text("Village, behavior changes, urgency") },
                minLines = 2,
                maxLines = 4
            )
        }

        item {
            PrimaryButton(
                text = "Classify Symptoms",
                onClick = onClassifySymptoms,
                icon = Icons.Rounded.Warning,
                enabled = uiState.symptoms.isNotBlank()
            )
        }

        if (uiState.triageHint.isNotBlank()) {
            item {
                Text(
                    text = uiState.triageHint,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.tertiary
                )
            }
        }

        item {
            PrimaryButton(
                text = "Submit Report",
                onClick = onSubmit,
                enabled = uiState.selectedAnimalId.isNotBlank() && uiState.symptoms.isNotBlank()
            )
        }

        if (uiState.errorMessage != null) {
            item {
                Text(uiState.errorMessage, color = MaterialTheme.colorScheme.error)
            }
        }
    }
}

@Composable
private fun AnimalChip(
    animal: Animal,
    selected: Boolean,
    onClick: () -> Unit
) {
    FilterChip(
        selected = selected,
        onClick = onClick,
        label = {
            Text("${animal.name} • ${animal.type.name.lowercase().replaceFirstChar { it.uppercase() }}")
        },
        modifier = Modifier.fillMaxWidth()
    )
}
