
import React from 'react';
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";

const SignIn = () => {
  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6">
          <ClerkSignIn routing="path" path="/sign-in" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
