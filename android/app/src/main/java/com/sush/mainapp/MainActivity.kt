package com.sush.mainapp

import android.os.Build
import android.os.Bundle
import android.view.KeyEvent
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import expo.modules.ReactActivityDelegateWrapper
import com.google.firebase.FirebaseApp
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.ReactApplicationContext

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.AppTheme)
        FirebaseApp.initializeApp(this)
        super.onCreate(null)
    }

    override fun getMainComponentName(): String = "main"

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return ReactActivityDelegateWrapper(
            this,
            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
            object : DefaultReactActivityDelegate(
                this,
                mainComponentName,
                fabricEnabled
            ) {}
        )
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        Log.d("VolumeKey", "onKeyDown triggered with keyCode: $keyCode")

        if (event != null && keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
            Log.d("VolumeKey", "Volume Down key detected in onKeyDown")

            val reactContext = (application as? ReactApplication)
                ?.reactNativeHost
                ?.reactInstanceManager
                ?.currentReactContext

            if (reactContext is ReactApplicationContext) {
                Log.d("VolumeKey", "ReactApplicationContext found, calling CustomModule")
                CustomModule(reactContext).detectVolumeDownTriplePress(keyCode, event)
                return true
            } else {
                Log.d("VolumeKey", "ReactApplicationContext is NULL in onKeyDown")
            }
        }
        
        Log.d("VolumeKey", "Event passed to super.onKeyDown")
        return super.onKeyDown(keyCode, event)
    }

    override fun dispatchKeyEvent(event: KeyEvent): Boolean {
        Log.d("VolumeKey", "dispatchKeyEvent triggered with keyCode: ${event.keyCode}")

        if (event.keyCode == KeyEvent.KEYCODE_VOLUME_DOWN && event.action == KeyEvent.ACTION_DOWN) {
            Log.d("VolumeKey", "Volume Down key detected in dispatchKeyEvent")

            val reactContext = (application as? ReactApplication)
                ?.reactNativeHost
                ?.reactInstanceManager
                ?.currentReactContext

            if (reactContext is ReactApplicationContext) {
                Log.d("VolumeKey", "ReactApplicationContext found, calling CustomModule")
                CustomModule(reactContext).detectVolumeDownTriplePress(event.keyCode, event)
                return true
            } else {
                Log.d("VolumeKey", "ReactApplicationContext is NULL in dispatchKeyEvent")
            }
        }

        return super.dispatchKeyEvent(event)
    }

    override fun invokeDefaultOnBackPressed() {
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
            if (!moveTaskToBack(false)) {
                super.invokeDefaultOnBackPressed()
            }
            return
        }
        super.invokeDefaultOnBackPressed()
    }
}
