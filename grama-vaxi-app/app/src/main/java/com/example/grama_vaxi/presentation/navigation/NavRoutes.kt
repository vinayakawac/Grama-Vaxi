package com.example.grama_vaxi.presentation.navigation

object NavRoutes {
    const val Splash = "splash"
    const val Language = "language"
    const val Login = "login"
    const val Otp = "otp"
    const val SignUp = "sign_up"

    const val FarmerHome = "farmer_home"
    const val AnimalLedger = "animal_ledger"
    const val RegisterAnimal = "register_animal"
    const val VaccineCalendar = "vaccine_calendar"
    const val Notifications = "notifications"
    const val DiseaseReport = "disease_report"
    const val Profile = "profile"

    const val CampAlertPattern = "camp_alert/{alertId}"
    fun campAlert(alertId: String): String = "camp_alert/$alertId"
}
