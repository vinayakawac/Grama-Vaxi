package com.example.grama_vaxi.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.grama_vaxi.domain.model.AppLanguage
import com.example.grama_vaxi.domain.model.AppTheme
import com.example.grama_vaxi.domain.model.SessionState
import com.example.grama_vaxi.domain.usecase.ObserveSessionUseCase
import com.example.grama_vaxi.domain.usecase.SendOtpUseCase
import com.example.grama_vaxi.domain.usecase.SetLanguageUseCase
import com.example.grama_vaxi.domain.usecase.SetThemeUseCase
import com.example.grama_vaxi.domain.usecase.SignOutUseCase
import com.example.grama_vaxi.domain.usecase.VerifyOtpUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

@HiltViewModel
class AuthViewModel @Inject constructor(
    observeSessionUseCase: ObserveSessionUseCase,
    private val setLanguageUseCase: SetLanguageUseCase,
    private val setThemeUseCase: SetThemeUseCase,
    private val signOutUseCase: SignOutUseCase,
    private val sendOtpUseCase: SendOtpUseCase,
    private val verifyOtpUseCase: VerifyOtpUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    private var cooldownJob: Job? = null

    init {
        viewModelScope.launch {
            observeSessionUseCase().collect { session ->
                _uiState.update { state ->
                    state.copy(session = session)
                }
            }
        }
    }

    fun selectLanguage(language: AppLanguage) {
        viewModelScope.launch {
            setLanguageUseCase(language)
        }
    }

    fun selectTheme(theme: AppTheme) {
        viewModelScope.launch {
            setThemeUseCase(theme)
        }
    }

    fun signOut() {
        viewModelScope.launch {
            signOutUseCase()
        }
    }

    fun onPhoneChanged(phone: String) {
        _uiState.update { it.copy(phoneNumber = phone.take(10), errorMessage = null) }
    }

    fun onOtpChanged(otp: String) {
        _uiState.update { it.copy(otp = otp.take(4), errorMessage = null) }
    }

    fun sendOtp(onSent: () -> Unit = {}) {
        if (_uiState.value.otpCooldownSeconds > 0) return

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }

            val result = sendOtpUseCase(_uiState.value.phoneNumber)
            result.fold(
                onSuccess = { token ->
                    _uiState.update {
                        it.copy(
                            verificationToken = token,
                            isLoading = false
                        )
                    }
                    startOtpCooldown()
                    onSent()
                },
                onFailure = { throwable ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = throwable.message ?: "Failed to send OTP"
                        )
                    }
                }
            )
        }
    }

    fun verifyOtp(onSuccess: () -> Unit) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val state = _uiState.value

            val result = verifyOtpUseCase(
                verificationToken = state.verificationToken,
                otpCode = state.otp
            )

            result.fold(
                onSuccess = {
                    _uiState.update {
                        it.copy(isLoading = false)
                    }
                    onSuccess()
                },
                onFailure = { throwable ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = throwable.message ?: "Invalid OTP"
                        )
                    }
                }
            )
        }
    }

    fun clearError() {
        _uiState.update { it.copy(errorMessage = null) }
    }

    private fun startOtpCooldown(seconds: Int = 30) {
        cooldownJob?.cancel()
        cooldownJob = viewModelScope.launch {
            for (remaining in seconds downTo 0) {
                _uiState.update { it.copy(otpCooldownSeconds = remaining) }
                delay(1_000)
            }
        }
    }
}

data class AuthUiState(
    val session: SessionState = SessionState(),
    val phoneNumber: String = "",
    val otp: String = "",
    val verificationToken: String = "",
    val otpCooldownSeconds: Int = 0,
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)
