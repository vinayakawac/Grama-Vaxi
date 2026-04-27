package com.example.grama_vaxi

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.grama_vaxi.domain.model.AppTheme
import com.example.grama_vaxi.domain.repository.SyncScheduler
import com.example.grama_vaxi.presentation.navigation.GramaVaxiNavHost
import com.example.grama_vaxi.presentation.viewmodel.AuthViewModel
import com.example.grama_vaxi.ui.theme.GramaVaxiTheme
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject
    lateinit var syncScheduler: SyncScheduler

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        syncScheduler.enqueuePeriodicSync()
        enableEdgeToEdge()
        setContent {
            val authViewModel: AuthViewModel = hiltViewModel()
            val authState by authViewModel.uiState.collectAsStateWithLifecycle()
            
            val darkTheme = when (authState.session.theme) {
                AppTheme.LIGHT -> false
                AppTheme.DARK -> true
                AppTheme.SYSTEM -> isSystemInDarkTheme()
            }

            GramaVaxiTheme(darkTheme = darkTheme) {
                GramaVaxiNavHost(authViewModel = authViewModel)
            }
        }
    }
}
