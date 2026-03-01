import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Delivery,
  FoodListing,
  FoodRequest,
  Notification,
  UserProfile,
} from "../backend";
import {
  DeliveryStatus,
  type ExternalBlob,
  Variant_expired_completed_claimed_available,
} from "../backend";
import { useActor } from "./useActor";

export { DeliveryStatus, Variant_expired_completed_claimed_available };

// ── Profile ──────────────────────────────────────────────────────────────────

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerProfile"] });
      qc.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
}

export function useCreateOrUpdateProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.createOrUpdateProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

// ── Platform Stats ────────────────────────────────────────────────────────────

export function usePlatformStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["platformStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPlatformStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

// ── Food Listings ─────────────────────────────────────────────────────────────

export function useAvailableListings(limit = 20n, offset = 0n) {
  const { actor, isFetching } = useActor();
  return useQuery<FoodListing[]>({
    queryKey: ["availableListings", limit.toString(), offset.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableListings(limit, offset);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
  });
}

export function useMyListings() {
  const { actor, isFetching } = useActor();
  return useQuery<FoodListing[]>({
    queryKey: ["myListings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllListings() {
  const { actor, isFetching } = useActor();
  return useQuery<FoodListing[]>({
    queryKey: ["allListings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (listing: FoodListing) => {
      if (!actor) throw new Error("Not connected");
      await actor.createListing(listing);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myListings"] });
      qc.invalidateQueries({ queryKey: ["availableListings"] });
      qc.invalidateQueries({ queryKey: ["allListings"] });
    },
  });
}

export function useCancelListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.cancelListing(listingId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myListings"] });
      qc.invalidateQueries({ queryKey: ["availableListings"] });
    },
  });
}

export function useClaimListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.claimListing(listingId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["availableListings"] });
      qc.invalidateQueries({ queryKey: ["myRequests"] });
      qc.invalidateQueries({ queryKey: ["allListings"] });
    },
  });
}

export function useUpdateListingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      listingId,
      status,
    }: {
      listingId: bigint;
      status: Variant_expired_completed_claimed_available;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateListingStatus(listingId, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allListings"] });
      qc.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
}

// ── Food Requests ─────────────────────────────────────────────────────────────

export function useMyRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<FoodRequest[]>({
    queryKey: ["myRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOpenRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<FoodRequest[]>({
    queryKey: ["openRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOpenRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<FoodRequest[]>({
    queryKey: ["allRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateFoodRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (request: FoodRequest) => {
      if (!actor) throw new Error("Not connected");
      await actor.createFoodRequest(request);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myRequests"] });
      qc.invalidateQueries({ queryKey: ["openRequests"] });
      qc.invalidateQueries({ queryKey: ["allRequests"] });
    },
  });
}

export function useCancelFoodRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.cancelFoodRequest(requestId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myRequests"] });
    },
  });
}

// ── Deliveries ────────────────────────────────────────────────────────────────

export function useMyDeliveries() {
  const { actor, isFetching } = useActor();
  return useQuery<Delivery[]>({
    queryKey: ["myDeliveries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyDeliveries();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10_000,
  });
}

export function useAllDeliveries() {
  const { actor, isFetching } = useActor();
  return useQuery<Delivery[]>({
    queryKey: ["allDeliveries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDeliveries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAvailableTasks() {
  const { actor, isFetching } = useActor();
  return useQuery<FoodListing[]>({
    queryKey: ["availableTasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableTasks();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
  });
}

export function useAcceptDelivery() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.acceptDelivery(listingId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["availableTasks"] });
      qc.invalidateQueries({ queryKey: ["myDeliveries"] });
    },
  });
}

export function useUpdateDeliveryStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      deliveryId,
      status,
      proofImage,
    }: {
      deliveryId: bigint;
      status: DeliveryStatus;
      proofImage?: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateDeliveryStatus(deliveryId, status, proofImage ?? null);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myDeliveries"] });
      qc.invalidateQueries({ queryKey: ["allDeliveries"] });
    },
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useToggleNgoApproval() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ngoId: import("@icp-sdk/core/principal").Principal) => {
      if (!actor) throw new Error("Not connected");
      await actor.toggleNgoApproval(ngoId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Notifications ─────────────────────────────────────────────────────────────

export function useMyNotifications() {
  const { actor, isFetching } = useActor();
  return useQuery<Notification[]>({
    queryKey: ["myNotifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyNotifications();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 20_000,
  });
}

export function useMarkNotificationRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myNotifications"] });
    },
  });
}
