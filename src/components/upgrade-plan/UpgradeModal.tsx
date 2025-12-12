"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation"; 

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  const router = useRouter(); // Initialize router

  async function handleUpgrade() {
    // 1. Close the modal
    onOpenChange(false); 
    // 2. Navigate the user to the pricing section
    router.push("/#pricing"); 
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Limit Exceeded</AlertDialogTitle>
          <AlertDialogDescription>
            You have **exhausted your monthly execution limit**. To continue creating and running workflows, please check out our subscription plans.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* Change action text to reflect navigation to pricing */}
          <AlertDialogAction onClick={handleUpgrade}>View Plans</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};