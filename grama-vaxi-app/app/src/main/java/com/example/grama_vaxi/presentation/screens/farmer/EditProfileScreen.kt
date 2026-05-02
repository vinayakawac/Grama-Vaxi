package com.example.grama_vaxi.presentation.screens.farmer

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import com.example.grama_vaxi.presentation.components.AppDimens
import com.example.grama_vaxi.presentation.viewmodel.AuthUiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditProfileScreen(
    uiState: AuthUiState,
    onSaveProfile: (
        userName: String,
        location: String,
        email: String,
        phoneNumber: String,
        age: String,
        roleLabel: String
    ) -> Unit,
    onBack: () -> Unit
) {
    var userName by rememberSaveable { mutableStateOf(uiState.session.userName) }
    var location by rememberSaveable { mutableStateOf(uiState.session.location) }
    var email by rememberSaveable { mutableStateOf(uiState.session.email) }
    var phoneNumber by rememberSaveable { mutableStateOf(uiState.session.phoneNumber) }
    var age by rememberSaveable { mutableStateOf(uiState.session.age) }
    var roleLabel by rememberSaveable { mutableStateOf(uiState.session.roleLabel) }

    LaunchedEffect(uiState.session) {
        userName = uiState.session.userName
        location = uiState.session.location
        email = uiState.session.email
        phoneNumber = uiState.session.phoneNumber
        age = uiState.session.age
        roleLabel = uiState.session.roleLabel
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Edit Profile") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Rounded.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
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
                            onBack()
                        }
                    ) {
                        Icon(Icons.Rounded.Check, contentDescription = "Save")
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
            verticalArrangement = Arrangement.spacedBy(AppDimens.gutter)
        ) {
            Text("Account Details", style = MaterialTheme.typography.titleMedium)

            OutlinedTextField(
                value = userName,
                onValueChange = { userName = it },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("User Name") },
                singleLine = true
            )
            OutlinedTextField(
                value = location,
                onValueChange = { location = it },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Location") },
                singleLine = true
            )
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Email (used for login)") },
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
            )
            OutlinedTextField(
                value = phoneNumber,
                onValueChange = { phoneNumber = it },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Phone") },
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
            )
            OutlinedTextField(
                value = age,
                onValueChange = { age = it },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Age") },
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
            )
            OutlinedTextField(
                value = roleLabel,
                onValueChange = { roleLabel = it },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Role (optional)") },
                singleLine = true
            )
        }
    }
}
