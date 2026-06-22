import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider, useClerk, useUser } from "@clerk/react";
import { BeautyHarmonyWebsite } from "./BeautyHarmonyWebsite.jsx";
import "./styles/base.css";
import "./styles/website.css";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
const appHomeUrl = `${window.location.origin}${window.location.pathname}`;

function toCustomerUser(user) {
  if (!user) return null;

  return {
    uid: user.id,
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "",
    phoneNumber: user.primaryPhoneNumber?.phoneNumber || user.phoneNumbers?.[0]?.phoneNumber || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    displayName: user.fullName || "",
  };
}

function ClerkAuthBridge() {
  const clerk = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const customerAuth = React.useMemo(
    () => ({
      provider: "clerk",
      isConfigured: true,
      isLoaded,
      user: isLoaded && isSignedIn ? toCustomerUser(user) : null,
      openSignIn: () => clerk.openSignIn(),
      openSignUp: () => clerk.openSignUp(),
      signOut: () => clerk.signOut({ redirectUrl: appHomeUrl }),
    }),
    [clerk, isLoaded, isSignedIn, user]
  );

  return <BeautyHarmonyWebsite customerAuth={customerAuth} />;
}

const missingClerkAuth = {
  provider: "clerk",
  isConfigured: false,
  isLoaded: true,
  user: null,
  openSignIn: () => {},
  openSignUp: () => {},
  signOut: async () => {},
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {clerkPublishableKey ? (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <ClerkAuthBridge />
      </ClerkProvider>
    ) : (
      <BeautyHarmonyWebsite customerAuth={missingClerkAuth} />
    )}
  </React.StrictMode>
);
