package com.example.grama_vaxi.data.repository

import com.example.grama_vaxi.data.local.preferences.SessionLocalDataSource
import com.example.grama_vaxi.domain.model.AppLanguage
import com.example.grama_vaxi.domain.model.SessionState
import com.example.grama_vaxi.domain.model.UserRole
import com.example.grama_vaxi.domain.repository.AuthRepository
import kotlinx.coroutines.flow.Flow
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val sessionLocalDataSource: SessionLocalDataSource
) : AuthRepository {

    private val pendingOtpTokens = ConcurrentHashMap<String, String>()

    override fun sessionState(): Flow<SessionState> = sessionLocalDataSource.sessionFlow

    override suspend fun setLanguage(language: AppLanguage) {
        sessionLocalDataSource.setLanguage(language)
    }

    override suspend fun sendOtp(phoneNumber: String): Result<String> = runCatching {
        require(phoneNumber.length == 10) { "Enter a valid 10 digit phone number" }
        val token = UUID.randomUUID().toString()
        pendingOtpTokens[token] = phoneNumber
        token
    }

    override suspend fun verifyOtp(
        verificationToken: String,
        otpCode: String
    ): Result<SessionState> = runCatching {
        val phone = pendingOtpTokens.remove(verificationToken)
            ?: error("OTP token expired. Request a new code.")

        require(otpCode.length == 4) { "OTP must be 4 digits" }
        val uid = "uid_${phone.takeLast(4)}"
        sessionLocalDataSource.saveSession(uid, UserRole.FARMER, phone)

        SessionState(
            isLoggedIn = true,
            userUid = uid,
            role = UserRole.FARMER,
            phoneNumber = phone
        )
    }

    override suspend fun signOut() {
        sessionLocalDataSource.clearSession()
    }
}
