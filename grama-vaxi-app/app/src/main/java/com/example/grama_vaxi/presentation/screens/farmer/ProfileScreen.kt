package com.example.grama_vaxi.presentation.screens.farmer

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.automirrored.rounded.Logout
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.example.grama_vaxi.domain.model.AppLanguage
import com.example.grama_vaxi.domain.model.AppTheme
import com.example.grama_vaxi.presentation.components.AppDimens
import com.example.grama_vaxi.presentation.viewmodel.AuthUiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    uiState: AuthUiState,
    onLanguageSelected: (AppLanguage) -> Unit,
    onThemeSelected: (AppTheme) -> Unit,
    onSaveProfile: (
        userName: String,
        location: String,
        email: String,
        phoneNumber: String,
        age: String,
        roleLabel: String
    ) -> Unit,
    onDeleteAccount: (onResult: (Boolean, String?) -> Unit) -> Unit,
    onLogout: () -> Unit,
    onBack: () -> Unit
) {
    var isEditing by rememberSaveable { mutableStateOf(false) }
    var userName by rememberSaveable { mutableStateOf(uiState.session.userName) }
    var location by rememberSaveable { mutableStateOf(uiState.session.location) }
    var email by rememberSaveable { mutableStateOf(uiState.session.email) }
    var phoneNumber by rememberSaveable { mutableStateOf(uiState.session.phoneNumber) }
    var age by rememberSaveable { mutableStateOf(uiState.session.age) }
    var roleLabel by rememberSaveable { mutableStateOf(uiState.session.roleLabel) }
    var showDeleteDialog by rememberSaveable { mutableStateOf(false) }
    var deleteError by rememberSaveable { mutableStateOf<String?>(null) }

    LaunchedEffect(uiState.session, isEditing) {
        if (!isEditing) {
            userName = uiState.session.userName
            location = uiState.session.location
            email = uiState.session.email
            phoneNumber = uiState.session.phoneNumber
            age = uiState.session.age
            roleLabel = uiState.session.roleLabel
            deleteError = null
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Profile") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Rounded.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    if (isEditing) {
                        IconButton(
                            onClick = {
                                onSaveProfile(
                                    userName,
                                    location,
                                    email,
                                    phoneNumber,
                                    age,
                                    roleLabel
                                )
                                isEditing = false
                            }
                        ) {
                            Icon(Icons.Rounded.Check, contentDescription = "Save")
                        }
                        IconButton(onClick = { isEditing = false }) {
                            Icon(Icons.Rounded.Close, contentDescription = "Cancel")
                        }
                    } else {
                        IconButton(onClick = { isEditing = true }) {
                            Icon(Icons.Rounded.Edit, contentDescription = "Edit")
                        }
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
            // Profile Header
            Icon(
                imageVector = Icons.Rounded.AccountCircle,
                contentDescription = null,
                modifier = Modifier.size(100.dp),
                tint = MaterialTheme.colorScheme.primary
            )

            Text(
                text = "Namaskara!",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = uiState.session.phoneNumber,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            HorizontalDivider(modifier = Modifier.padding(vertical = AppDimens.unit))

            // Customization Details Section
            ProfileSectionTitle(title = "Account Details")
            if (isEditing) {
                ProfileTextField(
                    label = "User Name",
                    value = userName,
                    onValueChange = { userName = it }
                )
                ProfileTextField(
                    label = "Location",
                    value = location,
                    onValueChange = { location = it }
                )
                ProfileTextField(
                    label = "Email (used for login)",
                    value = email,
                    onValueChange = { email = it },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
                )
                ProfileTextField(
                    label = "Phone",
                    value = phoneNumber,
                    onValueChange = { phoneNumber = it },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
                )
                ProfileTextField(
                    label = "Age",
                    value = age,
                    onValueChange = { age = it },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                )
                ProfileTextField(
                    label = "Role (optional)",
                    value = roleLabel,
                    onValueChange = { roleLabel = it }
                )

                ProfileSectionTitle(title = "Language")
                LanguageOption(
                    selected = uiState.session.language == AppLanguage.ENGLISH,
                    onClick = { onLanguageSelected(AppLanguage.ENGLISH) },
                    icon = Icons.Rounded.Language,
                    label = "English"
                )
                LanguageOption(
                    selected = uiState.session.language == AppLanguage.KANNADA,
                    onClick = { onLanguageSelected(AppLanguage.KANNADA) },
                    icon = Icons.Rounded.Translate,
                    label = "Kannada"
                )
            } else {
                ProfileInfoRow(icon = Icons.Rounded.Person, label = "User Name", value = uiState.session.userName)
                ProfileInfoRow(icon = Icons.Rounded.Place, label = "Location", value = uiState.session.location)
                ProfileInfoRow(icon = Icons.Rounded.Email, label = "Email", value = uiState.session.email)
                ProfileInfoRow(icon = Icons.Rounded.Phone, label = "Phone", value = uiState.session.phoneNumber)
                ProfileInfoRow(icon = Icons.Rounded.Cake, label = "Age", value = uiState.session.age)
                ProfileInfoRow(icon = Icons.Rounded.Badge, label = "Role", value = uiState.session.roleLabel)
                ProfileInfoRow(icon = Icons.Rounded.Language, label = "Language", value = uiState.session.language.name)
            }

            HorizontalDivider(modifier = Modifier.padding(vertical = AppDimens.unit))

            // Theme Selection Section
            ProfileSectionTitle(title = "App Theme")
            
            ThemeOption(
                selected = uiState.session.theme == AppTheme.SYSTEM,
                onClick = { onThemeSelected(AppTheme.SYSTEM) },
                icon = Icons.Rounded.SettingsSuggest,
                label = "System Default"
            )
            ThemeOption(
                selected = uiState.session.theme == AppTheme.LIGHT,
                onClick = { onThemeSelected(AppTheme.LIGHT) },
                icon = Icons.Rounded.LightMode,
                label = "Light Mode"
            )
            ThemeOption(
                selected = uiState.session.theme == AppTheme.DARK,
                onClick = { onThemeSelected(AppTheme.DARK) },
                icon = Icons.Rounded.DarkMode,
                label = "Dark Mode"
            )

            if (isEditing) {
                Spacer(modifier = Modifier.height(AppDimens.unit))
                Button(
                    onClick = { showDeleteDialog = true },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.errorContainer,
                        contentColor = MaterialTheme.colorScheme.onErrorContainer
                    )
                ) {
                    Icon(Icons.Rounded.DeleteForever, contentDescription = null)
                    Spacer(modifier = Modifier.width(AppDimens.unit))
                    Text("Delete Account")
                }

                deleteError?.let { message ->
                    Text(
                        text = message,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }

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

    if (showDeleteDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteDialog = false },
            title = { Text("Delete account?") },
            text = {
                Text(
                    "This will permanently delete your account and all data. This action cannot be undone."
                )
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        showDeleteDialog = false
                        onDeleteAccount { success, message ->
                            if (!success) {
                                deleteError = message ?: "Failed to delete account"
                            }
                        }
                    }
                ) {
                    Text("Delete")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteDialog = false }) {
                    Text("Cancel")
                }
            }
        )
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

@Composable
private fun ProfileInfoRow(icon: ImageVector, label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = AppDimens.unit),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
        Spacer(modifier = Modifier.width(AppDimens.gutter))
        Column {
            Text(label, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(value, style = MaterialTheme.typography.bodyLarge)
        }
    }
}

@Composable
private fun ThemeOption(
    selected: Boolean,
    onClick: () -> Unit,
    icon: ImageVector,
    label: String
) {
    Surface(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.medium,
        color = if (selected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface
    ) {
        Row(
            modifier = Modifier.padding(AppDimens.gutter),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, contentDescription = null, tint = if (selected) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurface)
            Spacer(modifier = Modifier.width(AppDimens.gutter))
            Text(
                text = label,
                style = MaterialTheme.typography.bodyLarge,
                color = if (selected) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurface,
                fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal
            )
            Spacer(modifier = Modifier.weight(1f))
            RadioButton(selected = selected, onClick = onClick)
        }
    }
}

@Composable
private fun LanguageOption(
    selected: Boolean,
    onClick: () -> Unit,
    icon: ImageVector,
    label: String
) {
    Surface(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.medium,
        color = if (selected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface
    ) {
        Row(
            modifier = Modifier.padding(AppDimens.gutter),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, contentDescription = null, tint = if (selected) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurface)
            Spacer(modifier = Modifier.width(AppDimens.gutter))
            Text(
                text = label,
                style = MaterialTheme.typography.bodyLarge,
                color = if (selected) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurface,
                fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal
            )
            Spacer(modifier = Modifier.weight(1f))
            RadioButton(selected = selected, onClick = onClick)
        }
    }
}

@Composable
private fun ProfileTextField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier.fillMaxWidth(),
        label = { Text(label) },
        singleLine = true,
        keyboardOptions = keyboardOptions
    )
}
