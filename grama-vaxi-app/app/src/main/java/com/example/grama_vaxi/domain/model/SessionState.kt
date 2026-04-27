package com.example.grama_vaxi.domain.model

data class SessionState(
    val isLoggedIn: Boolean = false,
    val userUid: String = "",
    val role: UserRole = UserRole.FARMER,
    val language: AppLanguage = AppLanguage.ENGLISH,
    val theme: AppTheme = AppTheme.SYSTEM,
    val phoneNumber: String = ""
)
