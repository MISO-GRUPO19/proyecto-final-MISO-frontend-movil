package com.getcapacitor.myapp;


import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject2;
import androidx.test.uiautomator.Until;
import android.content.Context;
import android.content.Intent;
import androidx.test.core.app.ApplicationProvider;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.*;

import java.util.List;


@RunWith(AndroidJUnit4.class)
public class FeatureHU34 {
  private static final long LAUNCH_TIMEOUT = 10000L;
  private static final String BASIC_SAMPLE_PACKAGE = "com.miempresa.miapp";

  private UiDevice device;

  @Before
  public void startApp() {

    device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());


    device.pressHome();


    String launcherPackage = device.getLauncherPackageName();
    assertThat(launcherPackage, notNullValue());
    device.wait(
      Until.hasObject(By.pkg(launcherPackage).depth(0)),
      LAUNCH_TIMEOUT
    );


    Context context = ApplicationProvider.getApplicationContext();
    Intent intent = context.getPackageManager().getLaunchIntentForPackage(BASIC_SAMPLE_PACKAGE);
    if (intent != null) {
      intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
      context.startActivity(intent);
    }


    device.wait(
      Until.hasObject(By.pkg(BASIC_SAMPLE_PACKAGE).depth(0)),
      LAUNCH_TIMEOUT
    );
  }

  @Test
  public void loginSuccessful() {

    UiObject2 emailInput = device.wait(
      Until.findObject(By.hint("Email")),
      5000
    );

    emailInput.setText("vendedor@ccp.com");

    UiObject2 passwordInput = device.wait(
      Until.findObject(By.hint("Contraseña")),
      5000
    );
    passwordInput.setText("Vendedor123-");
    UiObject2 loginButton = device.wait(
      Until.findObject(By.text("Iniciar sesión")),
      5000
    );
    loginButton.click();

    boolean textFounded = device.wait(Until.hasObject(By.text("Home")), 5000);
    Assert.assertTrue(textFounded);
  }

  @Test
  public void loginFailed() {
    UiObject2 emailInput = device.wait(
      Until.findObject(By.hint("Email")),
      5000
    );

    emailInput.setText("vendedor@ccp.com");

    UiObject2 passwordInput = device.wait(
      Until.findObject(By.hint("Contraseña")),
      5000
    );
    passwordInput.setText("123231-");
    UiObject2 loginButton = device.wait(
      Until.findObject(By.text("Iniciar sesión")),
      5000
    );
    loginButton.click();
    boolean textFound =  device.wait(
      Until.hasObject(By.text("Error de autenticación")), 5000);
    Assert.assertTrue(textFound);
  }

}
