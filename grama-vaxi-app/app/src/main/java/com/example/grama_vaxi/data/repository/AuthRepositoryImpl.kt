package com.example.grama_vaxi.data.repository

import android.app.Activity
import com.example.grama_vaxi.data.local.preferences.SessionLocalDataSource
import com.example.grama_vaxi.domain.model.AppLanguage
import com.example.grama_vaxi.domain.model.AppTheme
import com.example.grama_vaxi.domain.model.SessionState
import com.example.grama_vaxi.domain.model.UserRole
import com.example.grama_vaxi.domain.repository.AuthRepository
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthOptions
import com.google.firebase.auth.PhoneAuthProvider
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val sessionLocalDataSource: SessionLocalDataSource,
    private val firebaseAuth: FirebaseAuth
) : AuthRepository {

    override fun sessionState(): Flow<SessionState> = sessionLocalDataSource.sessionFlow

    override suspend fun setLanguage(language: AppLanguage) {
        sessionLocalDataSource.setLanguage(language)
    }

    override suspend fun setTheme(theme: AppTheme) {
        sessionLocalDataSource.setTheme(theme)
    }

    override suspend fun sendOtp(phoneNumber: String): Result<String> {
        require(phoneNumber.isNotBlank()) { "Phone number must not be blank" }
        val activity = FirebaseActivityHolder.activity
            ?: return Result.failure(IllegalStateException("No active Activity. Open the app properly."))

        return suspendCancellableCoroutine { cont ->
            val callbacks = object : PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
                override fun onVerificationCompleted(credential: PhoneAuthCredential) {
                    if (cont.isActive) cont.resume(Result.success("auto::${credential.smsCode ?: ""}"))
                }

                override fun onVerificationFailed(e: com.google.firebase.FirebaseException) {
                    if (cont.isActive) cont.resume(Result.failure(e))
                }

                override fun onCodeSent(
                    verificationId: String,
                    token: PhoneAuthProvider.ForceResendingToken
                ) {
                    FirebaseActivityHolder.resendToken = token
                    if (cont.isActive) cont.resume(Result.success(verificationId))
                }
            }

            val options = PhoneAuthOptions.newBuilder(firebaseAuth)
                .setPhoneNumber(phoneNumber)
                .setTimeout(60L, TimeUnit.SECONDS)
                .setActivity(activity)
                .setCallbacks(callbacks)
                .build()

            PhoneAuthProvider.verifyPhoneNumber(options)
        }
    }

    override suspend fun verifyOtp(
        verificationToken: String,
        otpCode: String
    ): Result<SessionState> {
        val credential: PhoneAuthCredential = if (verificationToken.startsWith("auto::")) {
            val autoCode = verificationToken.removePrefix("auto::")
            if (autoCode.isNotBlank()) {
                PhoneAuthProvider.getCredential(verificationToken, autoCode)
            } else {
                return Result.failure(IllegalStateException("Auto-verification failed. Enter OTP manually."))
            }
        } else {
            PhoneAuthProvider.getCredential(verificationToken, otpCode)
        }

        return signInWithCredential(credential)
    }

    private suspend fun signInWithCredential(credential: PhoneAuthCredential): Result<SessionState> =
        suspendCancellableCoroutine { cont ->
            firebaseAuth.signInWithCredential(credential)
                .addOnSuccessListener { result ->
                    val user = result.user
                    if (user == null) {
                        cont.resume(Result.failure(IllegalStateException("Sign-in succeeded but user is null")))
                        return@addOnSuccessListener
                    }
                    MainScope().launch {
                        sessionLocalDataSource.saveSession(
                            uid = user.uid,
                            role = UserRole.FARMER,
                            phoneNumber = user.phoneNumber ?: ""
                        )
                        val session = SessionState(
                            isLoggedIn = true,
                            userUid = user.uid,
                            role = UserRole.FARMER,
                            phoneNumber = user.phoneNumber ?: ""
                        )
                        cont.resume(Result.success(session))
                    }
                }
                .addOnFailureListener { e ->
                    cont.resume(Result.failure(e))
                }
        }

    override suspend fun signInWithGoogle(idToken: String): Result<SessionState> =
        suspendCancellableCoroutine { cont ->
            val credential = GoogleAuthProvider.getCredential(idToken, null)
            firebaseAuth.signInWithCredential(credential)
                .addOnSuccessListener { authResult ->
                    val user = authResult.user
                    if (user == null) {
                        cont.resume(Result.failure(IllegalStateException("Google sign-in: user is null")))
                        return@addOnSuccessListener
                    }
                    MainScope().launch {
                        sessionLocalDataSource.saveSession(
                            uid = user.uid,
                            role = UserRole.FARMER,
                            phoneNumber = user.phoneNumber ?: ""
                        )
                        cont.resume(Result.success(SessionState(
                            isLoggedIn = true,
                            userUid = user.uid,
                            role = UserRole.FARMER,
                            phoneNumber = user.phoneNumber ?: ""
                        )))
                    }
                }
                .addOnFailureListener { e -> cont.resume(Result.failure(e)) }
        }

    override suspend fun signOut() {
        firebaseAuth.signOut()
        sessionLocalDataSource.clearSession()
    }
}

object FirebaseActivityHolder {
    var activity: Activity? = null
    var resendToken: PhoneAuthProvider.ForceResendingToken? = null
}
