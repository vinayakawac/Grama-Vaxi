package com.example.grama_vaxi.presentation.screens.auth

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Login
import androidx.compose.material.icons.rounded.Sms
import androidx.compose.material.icons.rounded.Call
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import com.example.grama_vaxi.presentation.components.AppDimens
import com.example.grama_vaxi.presentation.components.InputField
import com.example.grama_vaxi.presentation.components.PrimaryButton
import com.example.grama_vaxi.presentation.components.SecondaryButton
import com.example.grama_vaxi.presentation.viewmodel.AuthUiState

@Composable
fun LoginScreen(
    uiState: AuthUiState,
    onPhoneChanged: (String) -> Unit,
    onOtpChanged: (String) -> Unit,
    onSendOtp: () -> Unit,
    onLogin: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .imePadding()
            .padding(horizontal = AppDimens.edge, vertical = AppDimens.edge),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Grama-Vaxi",
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "Login / ಲಾಗಿನ್",
            style = MaterialTheme.typography.bodyLarge,
            modifier = Modifier.padding(bottom = AppDimens.gutter)
        )

        InputField(
            value = uiState.phoneNumber,
            onValueChange = onPhoneChanged,
            label = "Phone Number / ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
            placeholder = "10 Digit Mobile Number",
            leadingIcon = Icons.Rounded.Call,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
        )

        Spacer(modifier = Modifier.height(AppDimens.gutter))

        SecondaryButton(
            text = if (uiState.otpCooldownSeconds == 0) {
                "Send OTP / ಓಟಿಪಿ ಕಳುಹಿಸಿ"
            } else {
                "Resend in ${uiState.otpCooldownSeconds}s"
            },
            onClick = onSendOtp,
            icon = Icons.Rounded.Sms,
            enabled = uiState.otpCooldownSeconds == 0 && !uiState.isLoading
        )

        Spacer(modifier = Modifier.height(AppDimens.gutter))

        InputField(
            value = uiState.otp,
            onValueChange = onOtpChanged,
            label = "Enter OTP / ಓಟಿಪಿ ನಮೂದಿಸಿ",
            placeholder = "4 digits",
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
        )

        Spacer(modifier = Modifier.height(AppDimens.gutter))

        PrimaryButton(
            text = "Login / ಲಾಗಿನ್",
            onClick = onLogin,
            icon = Icons.Rounded.Login,
            enabled = uiState.otp.length == 4 && !uiState.isLoading
        )

        if (uiState.errorMessage != null) {
            Text(
                text = uiState.errorMessage,
                color = MaterialTheme.colorScheme.error,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = AppDimens.unit)
            )
        }
    }
}
