
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!feedback.trim()) {
      toast({
        title: "Empty feedback",
        description: "Please enter some feedback before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate sending feedback
    setTimeout(() => {
      // In a real app, this would send the feedback to a server
      console.log("Feedback submitted:", feedback);
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleNewFeedback = () => {
    setFeedback("");
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        <p className="text-muted-foreground">Help us improve Trackify</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Send Feedback</CardTitle>
          <CardDescription>
            We value your input and use it to make Trackify better for everyone
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ThumbsUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Thank You!</h3>
              <p className="text-muted-foreground">
                Your feedback has been submitted and will help us improve Trackify.
              </p>
              <Button onClick={handleNewFeedback} className="mt-4">
                Send More Feedback
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p>
                Let us know what you think about Trackify, report issues, or suggest new features.
              </p>
              <Textarea
                placeholder="Type your feedback here..."
                className="min-h-32"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          )}
        </CardContent>
        {!submitted && (
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Your feedback helps shape the future of Trackify
            </p>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Submit Feedback
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Other Ways to Connect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Join our Community</h3>
              <p className="text-sm text-muted-foreground">
                Connect with other users and share your tracking strategies
              </p>
            </div>
            <div>
              <h3 className="font-medium">Follow Us</h3>
              <p className="text-sm text-muted-foreground">
                Stay updated with the latest features and news
              </p>
            </div>
            <div>
              <h3 className="font-medium">Report a Bug</h3>
              <p className="text-sm text-muted-foreground">
                Found something not working? Let us know so we can fix it
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Feedback;
