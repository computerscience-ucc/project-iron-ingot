// components/messenger/MessageBubble.js
// Individual message bubble component for the Messenger chat widget.

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: 2 }}>
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 12,
            fontSize: 14,
            lineHeight: 1.4,
            wordBreak: "break-word",
            background: isUser ? "#0084FF" : "#2a2a2a",
            color: isUser ? "white" : "#e0e0e0",
            borderBottomRightRadius: isUser ? 4 : 12,
            borderBottomLeftRadius: isUser ? 12 : 4,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          {message.text}
        </div>
        <span
          style={{
            fontSize: 10,
            color: "#888",
            textAlign: isUser ? "right" : "left",
            padding: "0 4px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
