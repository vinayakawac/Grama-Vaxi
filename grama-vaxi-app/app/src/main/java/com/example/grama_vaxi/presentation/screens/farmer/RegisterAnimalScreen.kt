package com.example.grama_vaxi.presentation.screens.farmer

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AddCircle
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.grama_vaxi.presentation.components.AnimalTypeSelector
import com.example.grama_vaxi.presentation.components.AppDimens
import com.example.grama_vaxi.presentation.components.InputField
import com.example.grama_vaxi.presentation.components.PhotoPickerBox
import com.example.grama_vaxi.presentation.components.PrimaryButton
import com.example.grama_vaxi.presentation.components.StepperInput
import com.example.grama_vaxi.presentation.viewmodel.RegisterAnimalUiState

@Composable
fun RegisterAnimalScreen(
    uiState: RegisterAnimalUiState,
    onNameChanged: (String) -> Unit,
    onBreedChanged: (String) -> Unit,
    onVillageChanged: (String) -> Unit,
    onAgeChanged: (Int) -> Unit,
    onTypeChanged: (com.example.grama_vaxi.domain.model.AnimalType) -> Unit,
    onPickPhoto: () -> Unit,
    onSubmit: () -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(AppDimens.edge),
        verticalArrangement = Arrangement.spacedBy(AppDimens.gutter)
    ) {
        item {
            Text("Register Animal", style = MaterialTheme.typography.headlineLarge)
        }

        item {
            Text("Animal Photo", style = MaterialTheme.typography.labelLarge)
            Spacer(modifier = Modifier.height(AppDimens.unit))
            PhotoPickerBox(
                onClick = onPickPhoto,
                title = "Tap to Take Photo",
                subtitle = "or select from gallery"
            )
        }

        item {
            AnimalTypeSelector(
                selectedType = uiState.type,
                onTypeSelected = onTypeChanged
            )
        }

        item {
            InputField(
                value = uiState.name,
                onValueChange = onNameChanged,
                label = "Animal Name",
                placeholder = "e.g., Gauri"
            )
        }

        item {
            InputField(
                value = uiState.breed,
                onValueChange = onBreedChanged,
                label = "Breed",
                placeholder = "e.g., Holstein"
            )
        }

        item {
            InputField(
                value = uiState.village,
                onValueChange = onVillageChanged,
                label = "Village",
                placeholder = "e.g., Palhalli"
            )
        }

        item {
            StepperInput(
                value = uiState.ageMonths,
                onValueChange = onAgeChanged,
                label = "Age (Months)"
            )
        }

        item {
            PrimaryButton(
                text = "Register Animal",
                onClick = onSubmit,
                icon = Icons.Rounded.AddCircle,
                height = 72.dp,
                enabled = uiState.breed.isNotBlank() && uiState.village.isNotBlank() && !uiState.isSaving
            )
        }

        if (uiState.errorMessage != null) {
            item {
                Text(uiState.errorMessage, color = MaterialTheme.colorScheme.error)
            }
        }
    }
}
