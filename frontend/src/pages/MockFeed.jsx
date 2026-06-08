import { MOCK_FEED_ITEMS } from "../__mocks__/feed.mock";
import ContentCard from "../components/ContentCard";

function MockFeed() {
  return (
    <div
      style={{
        padding: "16px",
        maxWidth: "375px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        backgroundColor: "#111214",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: "0.85rem",
          opacity: 0.4,
          textAlign: "center",
          margin: "8px 0",
        }}
      >
        🧪 MockFeed — Solo desarrollo
      </h1>
      {MOCK_FEED_ITEMS.map((item) => (
        <ContentCard
          key={item.contentId}
          {...item}
          onClick={() => console.log("clicked:", item.contentId)}
        />
      ))}
    </div>
  );
}

export default MockFeed;
