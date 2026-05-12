package com.example.grama_vaxi.presentation.screens.farmer

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AddCircle
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.Switch
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.stringResource
import com.example.grama_vaxi.R
import com.example.grama_vaxi.data.local.constants.KarnatakaPlaces
import com.example.grama_vaxi.presentation.components.AnimalTypeSelector
import com.example.grama_vaxi.presentation.components.AppDimens
import com.example.grama_vaxi.presentation.components.DropdownField
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
    onDistrictChanged: (String) -> Unit,
    onTalukChanged: (String) -> Unit,
    onVillageChanged: (String) -> Unit,
    onAgeChanged: (Int) -> Unit,
    onTypeChanged: (com.example.grama_vaxi.domain.model.AnimalType) -> Unit,
    onPickPhoto: () -> Unit,
    onUseProfileLocation: () -> Unit,
    onSubmit: () -> Unit
) {
    val isKannada = LocalConfiguration.current.locales[0].language == "kn"

    val districtOptions = remember(isKannada) {
        KarnatakaPlaces.districts.map { if (isKannada) it.districtKn else it.districtEn }
    }

    val selectedDistrictData = remember(uiState.district) {
        KarnatakaPlaces.districts.find { it.districtEn == uiState.district }
    }

    val talukOptions = remember(selectedDistrictData, isKannada) {
        selectedDistrictData?.taluks?.map { if (isKannada) it.kn else it.en } ?: emptyList()
    }

    var useProfileLocation by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(AppDimens.edge),
        verticalArrangement = Arrangement.spacedBy(AppDimens.gutter)
    ) {
        item {
            Text(stringResource(R.string.register_animal), style = MaterialTheme.typography.headlineLarge)
        }

        item {
            Text(stringResource(R.string.animal_photo), style = MaterialTheme.typography.labelLarge)
            Spacer(modifier = Modifier.height(AppDimens.unit))
            PhotoPickerBox(
                onClick = onPickPhoto,
                title = stringResource(R.string.tap_to_take_photo),
                subtitle = stringResource(R.string.or_select_from_gallery)
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
                label = stringResource(R.string.animal_name),
                placeholder = stringResource(R.string.animal_name_hint)
            )
        }

        item {
            InputField(
                value = uiState.breed,
                onValueChange = onBreedChanged,
                label = stringResource(R.string.breed),
                placeholder = stringResource(R.string.breed_hint)
            )
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = stringResource(R.string.use_profile_location),
                    style = MaterialTheme.typography.bodyLarge
                )
                Switch(
                    checked = useProfileLocation,
                    onCheckedChange = { 
                        useProfileLocation = it
                        if (it) onUseProfileLocation()
                    }
                )
            }
        }

        item {
            DropdownField(
                value = if (isKannada) {
                    selectedDistrictData?.districtKn ?: uiState.district
                } else uiState.district,
                options = districtOptions,
                onValueChange = { localizedDistrict ->
                    val districtEn = KarnatakaPlaces.districts.find { 
                        it.districtEn == localizedDistrict || it.districtKn == localizedDistrict 
                    }?.districtEn ?: localizedDistrict
                    onDistrictChanged(districtEn)
                },
                label = stringResource(R.string.district),
                placeholder = stringResource(R.string.select_district)
            )
        }

        item {
            DropdownField(
                value = if (isKannada) {
                    selectedDistrictData?.taluks?.find { it.en == uiState.taluk }?.kn ?: uiState.taluk
                } else uiState.taluk,
                onValueChange = { localizedTaluk ->
                    val talukEn = selectedDistrictData?.taluks?.find { 
                        it.en == localizedTaluk || it.kn == localizedTaluk 
                    }?.en ?: localizedTaluk
                    onTalukChanged(talukEn)
                },
                label = stringResource(R.string.taluk),
                options = talukOptions,
                enabled = uiState.district.isNotBlank(),
                placeholder = if (uiState.district.isNotBlank()) stringResource(R.string.select_taluk) else stringResource(R.string.select_district_first)
            )
        }

        item {
            InputField(
                value = uiState.village,
                onValueChange = onVillageChanged,
                label = stringResource(R.string.village),
                placeholder = stringResource(R.string.village_hint)
            )
        }

        item {
            StepperInput(
                value = uiState.ageMonths,
                onValueChange = onAgeChanged,
                label = stringResource(R.string.age_months)
            )
        }

        item {
            PrimaryButton(
                text = stringResource(R.string.register_animal),
                onClick = onSubmit,
                icon = Icons.Rounded.AddCircle,
                height = AppDimens.primaryButtonLarge,
                enabled = uiState.breed.isNotBlank() && 
                          uiState.village.isNotBlank() && 
                          uiState.district.isNotBlank() && 
                          uiState.taluk.isNotBlank() && 
                          !uiState.isSaving
            )
        }

        if (uiState.errorMessage != null) {
            item {
                Text(uiState.errorMessage, color = MaterialTheme.colorScheme.error)
            }
        }
    }
}
