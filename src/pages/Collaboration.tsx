
import { TeamChat } from "@/components/Chat/TeamChat";

export default function Collaboration() {
  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 animate-slide-up">Collaboration Hub</h1>
        <p className="text-muted-foreground mb-8 animate-fade-up">
          Work together with your team in real-time
        </p>
        
        <TeamChat />
      </div>
    </div>
  );
}
