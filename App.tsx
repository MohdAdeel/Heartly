import React, { useEffect } from "react";
import { AlertsProvider } from "./src/components/Alert";
import { AuthProvider } from "./src/context/AuthContext";
import ErrorBoundary from "./src/components/ErrorBoundary";
import AppNavigation from "./src/navigation/AppNavigation";
import { FilterProvider } from "./src/context/FilterContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

function App() {
  useEffect(() => {
    if (__DEV__) {
      console.log("App started");
    }
  }, []);

  return (
    <ErrorBoundary screenName="App">
      <SafeAreaProvider>
        <AlertsProvider>
          <AuthProvider>
            <FilterProvider>
              <AppNavigation />
            </FilterProvider>
          </AuthProvider>
        </AlertsProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
