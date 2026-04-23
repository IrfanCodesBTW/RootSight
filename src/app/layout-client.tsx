"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { TriggerModal } from "@/components/TriggerModal";
import { Toast } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

interface LayoutContextType {
  openTriggerModal: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within LayoutClient");
  return context;
}

export function LayoutClient({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, showToast } = useToast();
  const router = useRouter();

  const handleSuccess = (id: string) => {
    setIsModalOpen(false);
    showToast("Pipeline triggered successfully", "success");
    router.push(`/incidents/${id}`);
  };

  return (
    <LayoutContext.Provider value={{ 
      openTriggerModal: () => setIsModalOpen(true),
      showToast 
    }}>
      {children}
      {isModalOpen && (
        <TriggerModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleSuccess}
        />
      )}
      <Toast toasts={toasts} />
    </LayoutContext.Provider>
  );
}
