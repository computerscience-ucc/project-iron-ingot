import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import FacebookMessenger from "../components/FacebookMessenger";

jest.mock("../components/FacebookMessenger.module.css", () => ({
  messengerWidget: "messengerWidget",
}), { virtual: true });

describe("FacebookMessenger", () => {
  beforeEach(() => {
    delete window.FB;
    document.head.innerHTML = "";
    document.body.innerHTML = "";
  });

  it("renders nothing when pageId is missing", () => {
    const { container } = render(
      <FacebookMessenger pageId="" appId="123" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when appId is missing", () => {
    const { container } = render(
      <FacebookMessenger pageId="123" appId="" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when pageId is placeholder", () => {
    const { container } = render(
      <FacebookMessenger pageId="YOUR_FB_PAGE_ID" appId="123" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when appId is placeholder", () => {
    const { container } = render(
      <FacebookMessenger pageId="123" appId="YOUR_FB_APP_ID" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders a container div with valid IDs", () => {
    const { container } = render(
      <FacebookMessenger pageId="123456" appId="789012" />
    );
    const widgetDiv = container.firstChild;
    expect(widgetDiv).not.toBeNull();
    expect(widgetDiv.className).toContain("messengerWidget");
  });

  it("applies custom className", () => {
    const { container } = render(
      <FacebookMessenger pageId="123" appId="456" className="custom-class" />
    );
    const widgetDiv = container.firstChild;
    expect(widgetDiv.className).toContain("custom-class");
  });

  it("loads FB SDK script when mounted with valid IDs", () => {
    render(<FacebookMessenger pageId="123" appId="456" />);
    const script = document.getElementById("facebook-jssdk");
    expect(script).not.toBeNull();
    expect(script.src).toContain("connect.facebook.net");
  });

  it("does not load FB SDK when IDs are missing", () => {
    render(<FacebookMessenger pageId="" appId="" />);
    const script = document.getElementById("facebook-jssdk");
    expect(script).toBeNull();
  });

  it("does not load FB SDK when IDs are placeholders", () => {
    render(
      <FacebookMessenger pageId="YOUR_FB_PAGE_ID" appId="YOUR_FB_APP_ID" />
    );
    const script = document.getElementById("facebook-jssdk");
    expect(script).toBeNull();
  });
});
