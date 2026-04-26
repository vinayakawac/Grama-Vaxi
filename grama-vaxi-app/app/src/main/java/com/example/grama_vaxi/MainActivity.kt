package com.example.grama_vaxi

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.example.grama_vaxi.domain.repository.SyncScheduler
import com.example.grama_vaxi.presentation.navigation.GramaVaxiNavHost
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
            GramaVaxiTheme {
                GramaVaxiNavHost()
            }
        }
    }
}