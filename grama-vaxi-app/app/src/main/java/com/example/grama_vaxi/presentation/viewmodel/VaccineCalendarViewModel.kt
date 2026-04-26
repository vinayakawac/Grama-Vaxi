package com.example.grama_vaxi.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.grama_vaxi.domain.model.Animal
import com.example.grama_vaxi.domain.usecase.ObserveUpcomingVaccinesUseCase
import com.example.grama_vaxi.utils.DateUtils
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

@HiltViewModel
class VaccineCalendarViewModel @Inject constructor(
    private val observeUpcomingVaccinesUseCase: ObserveUpcomingVaccinesUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(VaccineCalendarUiState())
    val uiState: StateFlow<VaccineCalendarUiState> = _uiState.asStateFlow()

    private var observeJob: Job? = null

    fun start(ownerUid: String) {
        observeJob?.cancel()
        observeJob = viewModelScope.launch {
            observeUpcomingVaccinesUseCase(ownerUid, DateUtils.currentEpochDayUtc()).collectLatest { animals ->
                _uiState.update { it.copy(upcomingAnimals = animals, isLoading = false) }
            }
        }
    }
}

data class VaccineCalendarUiState(
    val upcomingAnimals: List<Animal> = emptyList(),
    val isLoading: Boolean = true
)
