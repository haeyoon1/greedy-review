import Container from "../components/Container";
import Header from "../components/Header";
import ThreadedReviewList from "../components/ThreadedReviewList/ThreadedReviewList";

export default function Detail() {
  return (
    <div className="detail-page">
      <Header showBackButton />
      <Container maxWidth="lg">
        <ThreadedReviewList />
      </Container>
    </div>
  );
}
