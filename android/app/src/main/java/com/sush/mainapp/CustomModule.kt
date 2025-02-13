package com.sush.mainapp

import android.net.TrafficStats
import android.os.Build
import android.os.Process
import android.os.Handler
import android.os.Looper
import android.app.usage.UsageStatsManager
import android.app.usage.UsageStats
import android.content.Context
import android.text.format.DateUtils
import android.content.pm.PackageManager
import android.content.Intent
import android.provider.Settings
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.app.AppOpsManager
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.WritableNativeArray
import android.util.Log
import android.app.usage.NetworkStatsManager;
import android.net.ConnectivityManager
import android.app.usage.NetworkStats
import android.Manifest
import android.telephony.TelephonyManager
import android.widget.Toast
import androidx.core.content.ContextCompat
import android.net.Uri
import android.view.KeyEvent

import android.content.ComponentName





class CustomModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val REQUEST_CODE_USAGE_STATS = 1001
        const val REQUEST_CODE_READ_PHONE_STATE = 1
    }

    private var volumeDownPressCount = 0
    private val handler = Handler(Looper.getMainLooper())

    private val resetCounterRunnable = Runnable {
        Log.d("CustomModule", "Resetting volume down press counter")
        volumeDownPressCount = 0
    }

    override fun getName(): String {
        return "CustomModule"
    }

    // Get the total data usage (Rx + Tx) for today for the current app
    @ReactMethod
    fun getMyTodayDataUsage(promise: Promise) {
        try {
            val uid = Process.myUid()
            val currentRxBytes = TrafficStats.getUidRxBytes(uid)
            val currentTxBytes = TrafficStats.getUidTxBytes(uid)

            if (currentRxBytes == TrafficStats.UNSUPPORTED.toLong() || currentTxBytes == TrafficStats.UNSUPPORTED.toLong()) {
                promise.reject("UNSUPPORTED", "Traffic stats are unsupported for this UID")
                return
            }

            val totalTodayUsage = currentRxBytes + currentTxBytes
            promise.resolve(totalTodayUsage.toDouble())
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    // Get the data usage stats for all apps installed on the device
    @ReactMethod
    fun getAppDataUsageForMonth(promise: Promise) {
        try {
            // Check if usage stats permission is granted
            if (!isUsageStatsPermissionGranted()) {
                promise.reject("PERMISSION_DENIED", "Permission to access usage stats is required.")
    
                // Guide the user to the Usage Access settings
                val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactApplicationContext.startActivity(intent)
                return
            }
    
            val networkStatsManager = reactApplicationContext.getSystemService(Context.NETWORK_STATS_SERVICE) as NetworkStatsManager
            val packageManager = reactApplicationContext.packageManager
    
            // Get data usage cycle range from system settings
            val startTime = getDataUsageStartTime()
            val endTime = getEndOfDate()
    
            val appStats = WritableNativeArray() // Create an array to hold app stats
    
            // Iterate through all installed apps
            val installedApps = packageManager.getInstalledApplications(PackageManager.GET_META_DATA)
            for (appInfo in installedApps) {
                val packageName = appInfo.packageName
                val uid = appInfo.uid
    
                try {
                    // Retrieve Wi-Fi data usage for the app
                    val wifiStats = networkStatsManager.queryDetailsForUid(
                        ConnectivityManager.TYPE_WIFI,
                        null,
                        startTime,
                        endTime,
                        uid
                    )
                    val wifiBucket = NetworkStats.Bucket()
                    var wifiRxBytes = 0L
                    var wifiTxBytes = 0L
                    while (wifiStats.hasNextBucket()) {
                        wifiStats.getNextBucket(wifiBucket)
                        wifiRxBytes += wifiBucket.rxBytes
                        wifiTxBytes += wifiBucket.txBytes
                    }
                    wifiStats.close()
    
                    // Retrieve Mobile data usage for the app
                    val mobileStats = networkStatsManager.queryDetailsForUid(
                        ConnectivityManager.TYPE_MOBILE,
                        null,
                        startTime,
                        endTime,
                        uid
                    )
                    val mobileBucket = NetworkStats.Bucket()
                    var mobileRxBytes = 0L
                    var mobileTxBytes = 0L
                    while (mobileStats.hasNextBucket()) {
                        mobileStats.getNextBucket(mobileBucket)
                        mobileRxBytes += mobileBucket.rxBytes
                        mobileTxBytes += mobileBucket.txBytes
                    }
                    mobileStats.close()
    
                    val totalRxBytes = wifiRxBytes + mobileRxBytes
                    val totalTxBytes = wifiTxBytes + mobileTxBytes
    
                    // Log data for debugging
                    Log.d("NetworkStats", "Package: $packageName, Wi-Fi Rx: $wifiRxBytes, Tx: $wifiTxBytes, Mobile Rx: $mobileRxBytes, Tx: $mobileTxBytes")
    
                    // Create app data map
                    val appData = WritableNativeMap()
                    appData.putString("packageName", packageName)
                    appData.putDouble("wifiReceivedUsage", wifiRxBytes.toDouble())
                    appData.putDouble("wifiUploadUsage", wifiTxBytes.toDouble())
                    appData.putDouble("mobileReceivedUsage", mobileRxBytes.toDouble())
                    appData.putDouble("mobileUploadUsage", mobileTxBytes.toDouble())
                    appData.putDouble("totalReceivedUsage", totalRxBytes.toDouble())
                    appData.putDouble("totalUploadUsage", totalTxBytes.toDouble())
    
                    // Add the app data to the array
                    appStats.pushMap(appData)
                } catch (e: Exception) {
                    Log.e("NetworkStats", "Error processing package: $packageName", e)
                }
            }
    
            // Resolve the promise with the app stats data array
            promise.resolve(appStats)
        } catch (e: Exception) {
            Log.e("getAppDataUsageForMonth", "Error fetching data usage stats", e)
            promise.reject("ERROR", e)
        }
    }


    private fun getEndOfDate(): Long {
        val calendar = java.util.Calendar.getInstance()
        calendar.set(java.util.Calendar.HOUR_OF_DAY, 23) // Set to the last hour of the day
        calendar.set(java.util.Calendar.MINUTE, 59)     // Set to the last minute of the hour
        calendar.set(java.util.Calendar.SECOND, 59)     // Set to the last second of the minute
        calendar.set(java.util.Calendar.MILLISECOND, 999) // Set to the last millisecond of the second
        return calendar.timeInMillis
    }
    
    /**
     * Get the start time of the data usage cycle from the system.
     */
    private fun getDataUsageStartTime(): Long {
        val calendar = java.util.Calendar.getInstance()
        calendar.set(java.util.Calendar.DAY_OF_MONTH, 1) // Default to the start of the month
        calendar.set(java.util.Calendar.HOUR_OF_DAY, 0)
        calendar.set(java.util.Calendar.MINUTE, 0)
        calendar.set(java.util.Calendar.SECOND, 0)
        calendar.set(java.util.Calendar.MILLISECOND, 0)
        return calendar.timeInMillis
    }


    @ReactMethod
    fun getTodayMobileDataUsage(promise: Promise) {
        try {
            // Check if usage stats permission is granted
            if (!isUsageStatsPermissionGranted()) {
                promise.reject("PERMISSION_DENIED", "Permission to access usage stats is required.")
                val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactApplicationContext.startActivity(intent)
                return
            }
    
            val networkStatsManager = reactApplicationContext.getSystemService(Context.NETWORK_STATS_SERVICE) as NetworkStatsManager
            val calendar = java.util.Calendar.getInstance()
            calendar.set(java.util.Calendar.HOUR_OF_DAY, 0)
            calendar.set(java.util.Calendar.MINUTE, 0)
            calendar.set(java.util.Calendar.SECOND, 0)
            calendar.set(java.util.Calendar.MILLISECOND, 0)
            val endTime = System.currentTimeMillis()
            val startTime = calendar.timeInMillis

    
            var totalMobileRxBytes = 0L
            var totalMobileTxBytes = 0L
            var totalWifiRxBytes = 0L
            var totalWifiTxBytes = 0L
    
            // Fetch mobile data usage
            val mobileStats = networkStatsManager.queryDetails(
                ConnectivityManager.TYPE_MOBILE,
                null,
                startTime,
                endTime
            )
            val mobileBucket = NetworkStats.Bucket()
            while (mobileStats.hasNextBucket()) {
                mobileStats.getNextBucket(mobileBucket)
                totalMobileRxBytes += mobileBucket.rxBytes
                totalMobileTxBytes += mobileBucket.txBytes
            }
            mobileStats.close()
    
            // Fetch Wi-Fi data usage
            val wifiStats = networkStatsManager.queryDetails(
                ConnectivityManager.TYPE_WIFI,
                null,
                startTime,
                endTime
            )
            val wifiBucket = NetworkStats.Bucket()
            while (wifiStats.hasNextBucket()) {
                wifiStats.getNextBucket(wifiBucket)
                totalWifiRxBytes += wifiBucket.rxBytes
                totalWifiTxBytes += wifiBucket.txBytes
            }
            wifiStats.close()
    
            val totalDataUsage = WritableNativeMap()
            totalDataUsage.putDouble("totalMobileRxBytes", totalMobileRxBytes.toDouble())
            totalDataUsage.putDouble("totalMobileTxBytes", totalMobileTxBytes.toDouble())
            totalDataUsage.putDouble("totalWifiRxBytes", totalWifiRxBytes.toDouble())
            totalDataUsage.putDouble("totalWifiTxBytes", totalWifiTxBytes.toDouble())
    
            promise.resolve(totalDataUsage)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
    

    


    // Check if usage stats permission is granted
private fun isUsageStatsPermissionGranted(): Boolean {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        val appOps = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), reactApplicationContext.packageName)
        // If the permission is granted, return true
        return mode == AppOpsManager.MODE_ALLOWED
    }
    // If the device is below Lollipop, the permission is not needed, so return false
    return false
}

@ReactMethod
fun requestIgnoreBatteryOptimization() {
    try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val powerManager = reactApplicationContext.getSystemService(Context.POWER_SERVICE) as android.os.PowerManager
            val packageName = reactApplicationContext.packageName

            // Check if the app is already ignoring battery optimizations
            if (!powerManager.isIgnoringBatteryOptimizations(packageName)) {
                // Show a dialog to allow ignoring battery optimization
                val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
                intent.data = Uri.parse("package:$packageName")
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                reactApplicationContext.startActivity(intent)
            } else {
                Log.d("TrafficStats", "Battery optimization is already ignored for this app.")
            }
        } else {
            Log.d("TrafficStats", "Battery optimization settings are not applicable for this Android version.")
        }
    } catch (e: Exception) {
        Log.e("TrafficStats", "Error requesting ignore battery optimization", e)
    }
}

    // Prompt user to enable usage access if not granted
    @ReactMethod
    fun requestUsageStatsPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            reactApplicationContext.startActivity(intent)
        }
    }


   
    @ReactMethod
    fun getIMEI(promise: Promise) {
        try {
            val telephonyManager = reactApplicationContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager

            // If permission is granted, proceed to fetch the IMEI
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // For Android 10 and above, try to get the IMEI from the first SIM slot (slotIndex = 0)
                val imei = telephonyManager.getImei(0)  // Change the slot index if necessary
                if (imei != null) {
                    promise.resolve(imei) // Return the IMEI if available
                } else {
                    promise.reject("ERROR-->2", "IMEI is not accessible on this device.")
                }
            } else {
                val imei = telephonyManager.getImei(1)  // Change the slot index if necessary
                if (imei != null) {
                    promise.resolve(imei) // Return the IMEI if available
                } else {
                    promise.reject("ERROR-->2", "IMEI is not accessible on this device.")
                }
            }
        } catch (e: Exception) {
            promise.reject("ERROR-->3", e)
        }
    }





    // Hide App Icon
    @ReactMethod
    fun hideAppIcon() {
        val packageManager = reactApplicationContext.packageManager
        val componentName = ComponentName(reactApplicationContext, LauncherAlias::class.java)
        
        packageManager.setComponentEnabledSetting(
            componentName,
            PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
            PackageManager.DONT_KILL_APP
        )
    }
    
    // Show App Icon
    @ReactMethod
    fun showAppIcon() {
        val packageManager = reactApplicationContext.packageManager
        val componentName = ComponentName(reactApplicationContext, LauncherAlias::class.java)
    
        packageManager.setComponentEnabledSetting(
            componentName,
            PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
            PackageManager.DONT_KILL_APP
        )
    }

    @ReactMethod
    fun detectVolumeDownTriplePress(keyCode: Int, event: KeyEvent?) {
        if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
            volumeDownPressCount++
            Log.d("CustomModule", "Volume Down Press Count: $volumeDownPressCount")

            if (volumeDownPressCount == 3) {
                Log.d("CustomModule", "Triple press detected! Performing action.")
                triggerTriplePressAction()
                resetCounter()
            } else {
                triggerTriplePressAction()
                resetCounter()
            }
        }
    }

    private fun resetCounter() {
        Log.d("CustomModule", "Resetting volume down press counter")
        volumeDownPressCount = 0
    }

    private fun triggerTriplePressAction() {
        Log.d("CustomModule", "Triggering app icon restore logic")
        showAppIcon() // Ensure this method is correctly implemented
    }


}
