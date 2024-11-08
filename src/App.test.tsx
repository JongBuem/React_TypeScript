import { render, screen } from "@testing-library/react";
import App from "./App";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./auth/authConfig";

test("renders learn react link", () => {
  // msalConfig를 기반으로 msalInstance를 생성합니다.
  const msalInstance = new PublicClientApplication(msalConfig);
  render(<App instance={msalInstance} />);

  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
