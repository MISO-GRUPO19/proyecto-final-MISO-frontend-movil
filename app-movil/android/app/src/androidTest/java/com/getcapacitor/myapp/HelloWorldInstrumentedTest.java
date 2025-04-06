package com.miempresa.miapp;

import android.content.Context;

import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import org.junit.Test;
import org.junit.runner.RunWith;

import static org.junit.Assert.assertTrue;

/**
 * Test básico que siempre pasa
 */
@RunWith(AndroidJUnit4.class)
public class HelloWorldInstrumentedTest {

    @Test
    public void alwaysPasses() {
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
        // Asegurarse que el contexto no sea null (esto siempre debería cumplirse)
        assertTrue(appContext != null);
    }
}
