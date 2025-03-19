
import React from 'react';
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";

const SignUp = () => {
  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6">
          <ClerkSignUp routing="path" path="/sign-up" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
