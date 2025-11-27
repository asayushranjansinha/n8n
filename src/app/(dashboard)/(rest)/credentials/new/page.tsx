import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CredentialsForm } from "@/features/credentials/components/CredentialsForm";

function CreateCrendtialPage() {
  return (
    <div className="p-4 flex-1 flex flex-col gap-4">
      <Card className="w-full shadow-none flex-1">
        <CardHeader className="md:text-start text-center">
          <CardTitle>Add New Credential</CardTitle>
          <CardDescription>
            Add an API key to connect to various workflow nodes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <CredentialsForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateCrendtialPage;
