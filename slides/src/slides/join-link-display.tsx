import QRCode from "qrcode.react";
import React from "react";
import { ClientManagerContext } from "./client-manager-context";

export function JoinLinkDisplay({ size = 256, level = "L" }: { size?: number; level?: "L" | "M" | "H" | "Q" }) {
  return (
    <ClientManagerContext.Consumer>
      {(clientManager) => {
        return (
          clientManager && (
            <QRCode level={level} size={size} value={`https://talk-web-apis.netlify.app/client?session=${clientManager.sessionId}`} />
          )
        );
      }}
    </ClientManagerContext.Consumer>
  );
}
