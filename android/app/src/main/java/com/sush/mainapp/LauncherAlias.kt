package com.sush.mainapp

import android.app.Activity
import android.os.Bundle

class LauncherAlias : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        finish() // Instantly close this dummy activity
    }
}
