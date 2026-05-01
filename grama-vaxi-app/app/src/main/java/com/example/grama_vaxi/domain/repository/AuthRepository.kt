package com.example.grama_vaxi.domain.repository

import com.example.grama_vaxi.domain.model.AppLanguage
import com.example.grama_vaxi.domain.model.AppTheme
import com.example.grama_vaxi.domain.model.SessionState
import kotlinx.coroutines.flow.Flow

interface AuthRepository {
    fun sessionState(): Flow<SessionState>
    suspend fun setLanguage(language: AppLanguage)
    suspend fun setTheme(theme: AppTheme)
    suspend fun sendOtp(phoneNumber: String): Result<String>
    suspend fun verifyOtp(
        verificationToken: String,
        otpCode: String
    ): Result<SessionState>
    suspend fun signInWithGoogle(idToken: String): Result<SessionState>
    suspend fun signOut()
}
