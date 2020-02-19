package com.dg.wenjuan.app.module;

import android.Manifest;
import android.app.ActivityManager;
import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.provider.Settings;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@ReactModule(name = ProcessModule.NAME)
public class ProcessModule extends ReactContextBaseJavaModule {

    static final String NAME = "ProcessModule";

    public ProcessModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void getProcess(Promise promise) {
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.LOLLIPOP) {
            try {
                ActivityManager am = (ActivityManager) getReactApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
                List<ActivityManager.RunningAppProcessInfo> infoList = am.getRunningAppProcesses();

                WritableArray array = Arguments.createArray();

                for (ActivityManager.RunningAppProcessInfo info : infoList) {
                    //进程名称
                    String processName = info.processName;

                    List<String> pkgs = Arrays.asList(info.pkgList);

                    PackageManager packageManager = Objects.requireNonNull(getCurrentActivity()).getPackageManager();

                    for (String packageName : pkgs) {
                        try {
                            WritableMap _info = Arguments.createMap();

                            ApplicationInfo applicationInfo = packageManager.getApplicationInfo(packageName, PackageManager.GET_META_DATA);

                            String appName = (String) packageManager.getApplicationLabel(applicationInfo);

                            if ((applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) <= 0) {
                                // 第三方应用
                                _info.putString("appName", appName);

                                _info.putString("package", applicationInfo.packageName);

                                _info.putString("processName", processName);

                                array.pushMap(_info);
                            }
                        } catch (Exception e) {

                        }
                    }


                }
            } catch (Exception e) {
                promise.reject(e);
            }
        } else {
            // 高版本获取
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                getUseAgeApp(promise);
            }
        }
    }

    @ReactMethod
    public void requestUsagePermission() {
        try {
            Intent intent = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
                intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            }
            Objects.requireNonNull(getCurrentActivity()).startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void isPermission(Promise promise) {
        boolean granted;
        AppOpsManager appOps;
        if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            try {
                appOps = (AppOpsManager) getReactApplicationContext()
                        .getSystemService(Context.APP_OPS_SERVICE);
                int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS,
                        android.os.Process.myUid(), getReactApplicationContext().getPackageName());

                if (mode == AppOpsManager.MODE_DEFAULT) {
                    granted = (getReactApplicationContext().checkCallingOrSelfPermission("android.permission.PACKAGE_USAGE_STATS") == PackageManager.PERMISSION_GRANTED);
                } else {
                    granted = (mode == AppOpsManager.MODE_ALLOWED);
                }
                promise.resolve(granted);
            } catch (Exception e) {
                promise.reject(e);
            }
        } else {
            promise.reject(new Exception("system not supported"));
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private void getUseAgeApp(Promise promise) {
        {
            boolean granted;
            AppOpsManager appOps = (AppOpsManager) getReactApplicationContext()
                    .getSystemService(Context.APP_OPS_SERVICE);
            int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS,
                    android.os.Process.myUid(), getReactApplicationContext().getPackageName());

            if (mode == AppOpsManager.MODE_DEFAULT) {
                granted = (getReactApplicationContext().checkCallingOrSelfPermission(android.Manifest.permission.PACKAGE_USAGE_STATS) == PackageManager.PERMISSION_GRANTED);
            } else {
                granted = (mode == AppOpsManager.MODE_ALLOWED);
            }

            if (granted) {
                // 同意
                long ts = System.currentTimeMillis();
                UsageStatsManager mUsageStatsManager = (UsageStatsManager) getReactApplicationContext().getSystemService(Context.USAGE_STATS_SERVICE); //Context.USAGE_STATS_SERVICE
                // 前10分钟数据
                List<UsageStats> queryUsageStats = mUsageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY,
                        ts - 1000 * 60 * 10 * 6, ts);
                if (queryUsageStats == null || queryUsageStats.isEmpty()) {
                    promise.resolve(null);
                    return;
                }

                WritableArray array = Arguments.createArray();

                try {
                    PackageManager packageManager = Objects.requireNonNull(getCurrentActivity()).getPackageManager();

                    for (UsageStats stats : queryUsageStats) {

                        String packageName = stats.getPackageName();
                        boolean inActive = mUsageStatsManager.isAppInactive(packageName);
                        if (!inActive) {
                            WritableMap info = Arguments.createMap();
                            ApplicationInfo applicationInfo = packageManager.getApplicationInfo(packageName, PackageManager.GET_META_DATA);

                            String appName = (String) packageManager.getApplicationLabel(applicationInfo);

                            if ((applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) <= 0) {
                                // 第三方应用
                                info.putString("appName", appName);

                                info.putString("package", applicationInfo.packageName);

                                array.pushMap(info);
                            }
                        }
                    }

                    promise.resolve(array);
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }
    }
}
