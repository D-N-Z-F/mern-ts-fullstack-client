import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChildrenProps } from "./layout";

export default function OAuthProvider({ children }: ChildrenProps) {
  return (
    <GoogleOAuthProvider clientId="247612732051-ha5thp9cribb2l7su323bko2eblb1k14.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
