package com.getcapacitor.myapp;
import org.json.JSONException;
import org.json.JSONObject;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject;
import androidx.test.uiautomator.UiObject2;
import androidx.test.uiautomator.UiObjectNotFoundException;
import androidx.test.uiautomator.Until;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;
import com.github.javafaker.Faker;
import androidx.test.core.app.ApplicationProvider;
import org.json.JSONArray;

import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.junit.Assert.*;
import androidx.test.uiautomator.UiSelector;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Random;
import java.util.regex.Pattern;
@RunWith(AndroidJUnit4.class)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class FeatureHU30 {

    private static final long LAUNCH_TIMEOUT = 10000L;
    private static final String BASIC_SAMPLE_PACKAGE = "com.miempresa.miapp";
    private UiDevice device;
    private static Faker faker = new Faker();
    @Before
    public void startApp() {
        // Initialize UiDevice instance
        device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());

        // Press home button
        device.pressHome();

        // Wait for launcher
        String launcherPackage = device.getLauncherPackageName();
        assertThat(launcherPackage, notNullValue());
        device.wait(Until.hasObject(By.pkg(launcherPackage).depth(0)), LAUNCH_TIMEOUT);

        // Launch the app
        Context context = ApplicationProvider.getApplicationContext();
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(BASIC_SAMPLE_PACKAGE);
        if (intent != null) {
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
        context.startActivity(intent);
        }

        device.wait(Until.hasObject(By.pkg(BASIC_SAMPLE_PACKAGE).depth(0)), LAUNCH_TIMEOUT);
    }

    @Test
    public void test1_checkSellerVisits(){
        device.wait(Until.findObject(By.hint("Email")), 5000).setText("test@testealo.coma");
        device.wait(Until.findObject(By.hint("Contraseña")), 5000).setText("569444423@Pass");
        SystemClock.sleep(2000);
        device.wait(Until.findObject(By.text("Iniciar sesión")), 5000).click();
        SystemClock.sleep(1000);
        List<UiObject2> allTextViews = device.findObjects(By.clazz("android.widget.TextView"));
        for (UiObject2 tv : allTextViews) {
          System.out.println(tv.getText());
          if (tv.getText() != null && tv.getText().trim().equals("Visitas")) {
            tv.click();
            break;
          }
        }
        SystemClock.sleep(1000);
        String storeName = "tortin Villada Supermercado";
        String clientName = "tortin Villada";
        String visitStatus = "No visitado";
        String storeName2 = "luis Villada Supermercado";
        String clientName2 = "luis Villada";
        boolean storeNameExists = false;
        boolean clientNameExists = false;
        boolean storeNameExists2 = false;
        boolean clientNameExists2 = false;
        boolean visitStatusExists = false;
        allTextViews = device.findObjects(By.clazz("android.widget.TextView"));
        for (UiObject2 tv : allTextViews) {
          System.out.println(tv.getText());
          if (tv.getText() != null && tv.getText().trim().equals(storeName)) {
            storeNameExists = true;
          }
          if (tv.getText() != null && tv.getText().trim().equals(clientName)) {
            clientNameExists = true;
          }
          if (tv.getText() != null && tv.getText().trim().equals(visitStatus)) {
            visitStatusExists = true;
          }
          if (tv.getText() != null && tv.getText().trim().equals(storeName2)) {
            storeNameExists2 = true;
          }
          if (tv.getText() != null && tv.getText().trim().equals(clientName2)) {
            clientNameExists2 = true;
          }
        }
        Assert.assertTrue(clientNameExists);
        Assert.assertTrue(storeNameExists);
        Assert.assertTrue(clientNameExists2);
        Assert.assertTrue(storeNameExists2);
        Assert.assertTrue(visitStatusExists);
    }
}
