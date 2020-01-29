package com.dg.wenjuan.app.module;

import android.app.ActivityManager;
import android.content.Context;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.util.List;

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
        ActivityManager am = (ActivityManager) getReactApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> infoList = am.getRunningAppProcesses();
        for (ActivityManager.RunningAppProcessInfo info : infoList) {
            //进程名称
            String processName = info.processName;
            //进程的重要程度(越低越重要)
            int importance = info.importance;


        }
    }
}
