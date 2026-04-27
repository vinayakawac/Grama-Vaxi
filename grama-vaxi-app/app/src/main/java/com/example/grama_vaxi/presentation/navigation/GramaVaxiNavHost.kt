package com.example.grama_vaxi.presentation.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AccountCircle
import androidx.compose.material.icons.rounded.Menu
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.grama_vaxi.domain.model.AppLanguage
import com.example.grama_vaxi.presentation.screens.auth.LanguageSelectionScreen
import com.example.grama_vaxi.presentation.screens.auth.LoginScreen
import com.example.grama_vaxi.presentation.screens.auth.OtpVerificationScreen
import com.example.grama_vaxi.presentation.screens.auth.SplashScreen
import com.example.grama_vaxi.presentation.screens.farmer.AnimalLedgerScreen
import com.example.grama_vaxi.presentation.screens.farmer.CampAlertScreen
import com.example.grama_vaxi.presentation.screens.farmer.DiseaseReportScreen
import com.example.grama_vaxi.presentation.screens.farmer.HomeDashboardScreen
import com.example.grama_vaxi.presentation.screens.farmer.NotificationsScreen
import com.example.grama_vaxi.presentation.screens.farmer.ProfileScreen
import com.example.grama_vaxi.presentation.screens.farmer.RegisterAnimalScreen
import com.example.grama_vaxi.presentation.screens.farmer.VaccineCalendarScreen
import com.example.grama_vaxi.presentation.viewmodel.AnimalLedgerViewModel
import com.example.grama_vaxi.presentation.viewmodel.AuthViewModel
import com.example.grama_vaxi.presentation.viewmodel.CampAlertViewModel
import com.example.grama_vaxi.presentation.viewmodel.DiseaseReportViewModel
import com.example.grama_vaxi.presentation.viewmodel.HomeViewModel
import com.example.grama_vaxi.presentation.viewmodel.NotificationsViewModel
import com.example.grama_vaxi.presentation.viewmodel.RegisterAnimalViewModel
import com.example.grama_vaxi.presentation.viewmodel.VaccineCalendarViewModel

@Composable
fun GramaVaxiNavHost(authViewModel: AuthViewModel) {
    val navController = rememberNavController()
    val authState by authViewModel.uiState.collectAsStateWithLifecycle()

    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route

    val farmerRoutes = setOf(
        NavRoutes.FarmerHome,
        NavRoutes.AnimalLedger,
        NavRoutes.VaccineCalendar,
        NavRoutes.Notifications
    )

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            if (currentRoute in farmerRoutes) {
                FarmerTopBar(
                    onProfileClick = { navController.navigate(NavRoutes.Profile) }
                )
            }
        },
        bottomBar = {
            if (currentRoute in farmerRoutes) {
                FarmerBottomBar(currentRoute = currentRoute) { route ->
                    navController.navigate(route) {
                        launchSingleTop = true
                        restoreState = true
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = NavRoutes.Splash,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(NavRoutes.Splash) {
                SplashScreen(
                    onFinished = {
                        val destination = if (authState.session.isLoggedIn) {
                            NavRoutes.FarmerHome
                        } else {
                            NavRoutes.Language
                        }
                        navController.navigate(destination) {
                            popUpTo(NavRoutes.Splash) { inclusive = true }
                        }
                    }
                )
            }

            composable(NavRoutes.Language) {
                LanguageSelectionScreen(
                    onKannadaSelected = {
                        authViewModel.selectLanguage(AppLanguage.KANNADA)
                        navController.navigate(NavRoutes.Login)
                    },
                    onEnglishSelected = {
                        authViewModel.selectLanguage(AppLanguage.ENGLISH)
                        navController.navigate(NavRoutes.Login)
                    }
                )
            }

            composable(NavRoutes.Login) {
                LoginScreen(
                    uiState = authState,
                    onPhoneChanged = authViewModel::onPhoneChanged,
                    onOtpChanged = authViewModel::onOtpChanged,
                    onSendOtp = {
                        authViewModel.sendOtp {
                            navController.navigate(NavRoutes.Otp)
                        }
                    },
                    onLogin = {
                        authViewModel.verifyOtp {
                            navController.navigate(NavRoutes.FarmerHome) {
                                popUpTo(NavRoutes.Login) { inclusive = true }
                            }
                        }
                    }
                )
            }

            composable(NavRoutes.Otp) {
                OtpVerificationScreen(
                    uiState = authState,
                    onOtpChanged = authViewModel::onOtpChanged,
                    onVerify = {
                        authViewModel.verifyOtp {
                            navController.navigate(NavRoutes.FarmerHome) {
                                popUpTo(NavRoutes.Login) { inclusive = true }
                            }
                        }
                    }
                )
            }

            composable(NavRoutes.FarmerHome) {
                val viewModel: HomeViewModel = hiltViewModel()
                val uiState by viewModel.uiState.collectAsStateWithLifecycle()

                LaunchedEffect(authState.session.userUid) {
                    if (authState.session.userUid.isNotBlank()) {
                        viewModel.start(authState.session.userUid)
                    }
                }

                HomeDashboardScreen(
                    uiState = uiState,
                    onRegisterAnimal = { navController.navigate(NavRoutes.RegisterAnimal) },
                    onViewCalendar = { navController.navigate(NavRoutes.VaccineCalendar) },
                    onReportDisease = { navController.navigate(NavRoutes.DiseaseReport) }
                )
            }

            composable(NavRoutes.AnimalLedger) {
                val viewModel: AnimalLedgerViewModel = hiltViewModel()
                val uiState by viewModel.uiState.collectAsStateWithLifecycle()

                LaunchedEffect(authState.session.userUid) {
                    if (authState.session.userUid.isNotBlank()) {
                        viewModel.start(authState.session.userUid)
                    }
                }

                AnimalLedgerScreen(
                    uiState = uiState,
                    onAddAnimal = { navController.navigate(NavRoutes.RegisterAnimal) },
                    onDeleteAnimal = viewModel::deleteAnimal
                )
            }

            composable(NavRoutes.RegisterAnimal) {
                val viewModel: RegisterAnimalViewModel = hiltViewModel()
                val uiState by viewModel.uiState.collectAsStateWithLifecycle()

                RegisterAnimalScreen(
                    uiState = uiState,
                    onNameChanged = viewModel::onNameChanged,
                    onBreedChanged = viewModel::onBreedChanged,
                    onVillageChanged = viewModel::onVillageChanged,
                    onAgeChanged = viewModel::onAgeChanged,
                    onTypeChanged = viewModel::onTypeChanged,
                    onPickPhoto = { viewModel.onPhotoChanged(null) },
                    onSubmit = {
                        viewModel.register(authState.session.userUid) {
                            navController.popBackStack()
                        }
                    }
                )
            }

            composable(NavRoutes.VaccineCalendar) {
                val viewModel: VaccineCalendarViewModel = hiltViewModel()
                val uiState by viewModel.uiState.collectAsStateWithLifecycle()

                LaunchedEffect(authState.session.userUid) {
                    if (authState.session.userUid.isNotBlank()) {
                        viewModel.start(authState.session.userUid)
                    }
                }

                VaccineCalendarScreen(uiState = uiState)
            }

            composable(NavRoutes.Notifications) {
                val viewModel: NotificationsViewModel = hiltViewModel()
                val uiState by viewModel.uiState.collectAsStateWithLifecycle()

                LaunchedEffect(authState.session.userUid) {
                    if (authState.session.userUid.isNotBlank()) {
                        viewModel.start(authState.session.userUid)
                    }
                }

                NotificationsScreen(
                    uiState = uiState,
                    onMarkRead = viewModel::markAsRead,
                    onOpenAlert = { alertId -> navController.navigate(NavRoutes.campAlert(alertId)) }
                )
            }

            composable(NavRoutes.DiseaseReport) {
                val viewModel: DiseaseReportViewModel = hiltViewModel()
                val uiState by viewModel.uiState.collectAsStateWithLifecycle()

                LaunchedEffect(authState.session.userUid) {
                    if (authState.session.userUid.isNotBlank()) {
                        viewModel.start(authState.session.userUid)
                    }
                }

                DiseaseReportScreen(
                    uiState = uiState,
                    onAnimalSelected = viewModel::onAnimalSelected,
                    onSymptomsChanged = viewModel::onSymptomsChanged,
                    onNotesChanged = viewModel::onNotesChanged,
                    onAffectedCountChanged = viewModel::onAffectedCountChanged,
                    onClassifySymptoms = viewModel::classifySymptoms,
                    onSubmit = {
                        viewModel.submit(authState.session.userUid) {
                            navController.popBackStack()
                        }
                    }
                )
            }

            composable(
                route = NavRoutes.CampAlertPattern,
                arguments = listOf(navArgument("alertId") { type = NavType.StringType })
            ) { entry ->
                val alertId = entry.arguments?.getString("alertId").orEmpty()
                val viewModel: CampAlertViewModel = hiltViewModel()
                val uiState by viewModel.uiState.collectAsStateWithLifecycle()

                LaunchedEffect(alertId, authState.session.userUid) {
                    viewModel.load(authState.session.userUid, alertId)
                }

                CampAlertScreen(
                    alert = uiState.alert,
                    onMarkRead = viewModel::markRead
                )
            }

            composable(NavRoutes.Profile) {
                ProfileScreen(
                    uiState = authState,
                    onThemeSelected = authViewModel::selectTheme,
                    onLogout = {
                        authViewModel.signOut()
                        navController.navigate(NavRoutes.Login) {
                            popUpTo(0) { inclusive = true }
                        }
                    },
                    onBack = { navController.popBackStack() }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun FarmerTopBar(onProfileClick: () -> Unit) {
    CenterAlignedTopAppBar(
        title = {
            Text(
                text = "Grama-Vaxi",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.SemiBold
            )
        },
        navigationIcon = {
            IconButton(onClick = {}) {
                Icon(Icons.Rounded.Menu, contentDescription = "Menu")
            }
        },
        actions = {
            IconButton(onClick = onProfileClick) {
                Icon(Icons.Rounded.AccountCircle, contentDescription = "Profile")
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainerLowest,
            titleContentColor = MaterialTheme.colorScheme.primary,
            navigationIconContentColor = MaterialTheme.colorScheme.primary,
            actionIconContentColor = MaterialTheme.colorScheme.primary
        )
    )
}
