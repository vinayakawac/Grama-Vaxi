package com.example.grama_vaxi.presentation.screens.farmer

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.automirrored.rounded.Logout
import androidx.compose.material.icons.rounded.Edit
import androidx.compose.material.icons.rounded.Gavel
import androidx.compose.material.icons.rounded.Language
import androidx.compose.material.icons.rounded.Notifications
import androidx.compose.material.icons.rounded.NotificationsActive
import androidx.compose.material.icons.rounded.Palette
import androidx.compose.material.icons.rounded.Security
import androidx.compose.material.icons.rounded.AccountCircle
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.grama_vaxi.presentation.components.AppDimens
import com.example.grama_vaxi.presentation.components.SettingsActionRow
import com.example.grama_vaxi.presentation.viewmodel.AuthUiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    uiState: AuthUiState,
    onEditProfile: () -> Unit,
    onOpenNotifications: () -> Unit,
    onOpenNotificationSettings: () -> Unit,
    onOpenAppPermissions: () -> Unit,
    onOpenTerms: () -> Unit,
    onOpenTheme: () -> Unit,
    onOpenLanguage: () -> Unit,
    onLogout: () -> Unit,
    onBack: () -> Unit
) {
    val contactLine = when {
        uiState.session.email.isNotBlank() -> uiState.session.email
        uiState.session.phoneNumber.isNotBlank() -> uiState.session.phoneNumber
        else -> "Add contact information"
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Profile") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Rounded.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(AppDimens.gutter),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(AppDimens.gutter)
        ) {
            Icon(
                imageVector = Icons.Rounded.AccountCircle,
                contentDescription = null,
                modifier = Modifier.size(100.dp),
                tint = MaterialTheme.colorScheme.primary
            )

            Text(
                text = uiState.session.userName.ifBlank { "Your profile" },
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = contactLine,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            HorizontalDivider(modifier = Modifier.padding(vertical = AppDimens.unit))

            ProfileSectionTitle(title = "Quick Actions")
            SettingsActionRow(
                icon = Icons.Rounded.Edit,
                title = "Edit profile",
                subtitle = "Update name, phone, and location",
                onClick = onEditProfile
            )
            SettingsActionRow(
                icon = Icons.Rounded.Notifications,
                title = "Alerts & reminders",
                subtitle = "Open your in-app notifications",
                onClick = onOpenNotifications
            )
            SettingsActionRow(
                icon = Icons.Rounded.NotificationsActive,
                title = "Notification settings",
                subtitle = "Manage system notification permissions",
                onClick = onOpenNotificationSettings
            )
            SettingsActionRow(
                icon = Icons.Rounded.Security,
                title = "App permissions",
                subtitle = "Open app permissions and privacy controls",
                onClick = onOpenAppPermissions
            )

            HorizontalDivider(modifier = Modifier.padding(vertical = AppDimens.unit))

            ProfileSectionTitle(title = "Preferences")
            SettingsActionRow(
                icon = Icons.Rounded.Language,
                title = "Language",
                subtitle = "Change app language",
                onClick = onOpenLanguage
            )
            SettingsActionRow(
                icon = Icons.Rounded.Palette,
                title = "Dark mode",
                subtitle = "Choose light, dark, or system",
                onClick = onOpenTheme
            )

            HorizontalDivider(modifier = Modifier.padding(vertical = AppDimens.unit))

            ProfileSectionTitle(title = "Legal")
            SettingsActionRow(
                icon = Icons.Rounded.Gavel,
                title = "Terms & Conditions",
                subtitle = "Read terms and delete account",
                onClick = onOpenTerms
            )

            Spacer(modifier = Modifier.weight(1f))

            Button(
                onClick = onLogout,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.errorContainer,
                    contentColor = MaterialTheme.colorScheme.onErrorContainer
                )
            ) {
                Icon(Icons.AutoMirrored.Rounded.Logout, contentDescription = null)
                Spacer(modifier = Modifier.width(AppDimens.unit))
                Text("Logout")
            }
        }
    }
}

@Composable
private fun ProfileSectionTitle(title: String) {
    Text(
        text = title,
        style = MaterialTheme.typography.titleMedium,
        fontWeight = FontWeight.Bold,
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.primary
    )
}
