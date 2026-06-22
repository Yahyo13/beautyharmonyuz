import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider, useAuth, useClerk, useUser } from "@clerk/react";
import { BeautyHarmonyWebsite } from "./BeautyHarmonyWebsite.jsx";
import "./styles/base.css";
import "./styles/website.css";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
const appHomeUrl = `${window.location.origin}${window.location.pathname}`;

function toCustomerUser(user, userId = "") {
  const uid = user?.id || userId || "";
  if (!uid) return null;

  return {
    uid,
    id: uid,
    email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "",
    phoneNumber: user.primaryPhoneNumber?.phoneNumber || user.phoneNumbers?.[0]?.phoneNumber || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    displayName: user.fullName || "",
  };
}

function ClerkAuthBridge() {
  const clerk = useClerk();
  const { isLoaded, isSignedIn, sessionId, userId } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const customerUser = isLoaded && isSignedIn ? toCustomerUser(user, userId) : null;
  const authVersion = `${isLoaded ? "loaded" : "loading"}:${isSignedIn ? "in" : "out"}:${userId || ""}:${sessionId || ""}:${isUserLoaded ? "user" : "nouser"}`;
  const customerAuth = React.useMemo(
    () => ({
      provider: "clerk",
      isConfigured: true,
      isLoaded,
      authVersion,
      user: customerUser,
      openSignIn: () => clerk.openSignIn(),
      openSignUp: () => clerk.openSignUp(),
      signOut: () => clerk.signOut({ redirectUrl: appHomeUrl }),
    }),
    [authVersion, clerk, customerUser, isLoaded]
  );

  return <BeautyHarmonyWebsite customerAuth={customerAuth} />;
}

const missingClerkAuth = {
  provider: "clerk",
  isConfigured: false,
  isLoaded: true,
  authVersion: "missing",
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
