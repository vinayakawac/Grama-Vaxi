package com.example.grama_vaxi.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.grama_vaxi.domain.model.HealthAlert
import com.example.grama_vaxi.domain.usecase.MarkAlertReadUseCase
import com.example.grama_vaxi.domain.usecase.ObserveAlertsUseCase
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
class NotificationsViewModel @Inject constructor(
    private val observeAlertsUseCase: ObserveAlertsUseCase,
    private val markAlertReadUseCase: MarkAlertReadUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(NotificationsUiState())
    val uiState: StateFlow<NotificationsUiState> = _uiState.asStateFlow()

    private var observeJob: Job? = null

    fun start(ownerUid: String) {
        observeJob?.cancel()
        observeJob = viewModelScope.launch {
            observeAlertsUseCase(ownerUid).collectLatest { alerts ->
                _uiState.update { it.copy(alerts = alerts, isLoading = false) }
            }
        }
    }

    fun markAsRead(alertId: String) {
        viewModelScope.launch {
            val result = markAlertReadUseCase(alertId)
            result.onFailure { throwable ->
                _uiState.update { it.copy(errorMessage = throwable.message ?: "Unable to update alert") }
            }
        }
    }
}

data class NotificationsUiState(
    val alerts: List<HealthAlert> = emptyList(),
    val isLoading: Boolean = true,
    val errorMessage: String? = null
)
