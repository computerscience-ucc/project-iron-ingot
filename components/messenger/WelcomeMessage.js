// components/messenger/WelcomeMessage.js
// Welcome/empty state shown when chat is first opened.

export default function WelcomeMessage() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "rgba(0, 132, 255, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.477 2 2 6.145 2 11.243c0 2.837 1.397 5.373 3.583 7.034-.164 1.797-.958 3.353-.963 3.386a.25.25 0 00.316.307c2.086-.691 3.693-1.55 4.484-2.108A11.15 11.15 0 0012 22.486c5.523 0 10-4.145 10-9.243C22 8.145 17.523 2 12 2z"
            fill="#0084FF"
          />
        </svg>
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "#e0e0e0",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        UCC CS Council
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#888",
          lineHeight: 1.5,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        Send us a message and we&apos;ll get back to you via your Facebook Messenger inbox.
      </div>
    </div>
  );
}
