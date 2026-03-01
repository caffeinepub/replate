import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface FoodListing {
    id: bigint;
    status: Variant_expired_completed_claimed_available;
    expiresAt: Time;
    createdAt: Time;
    unit: Variant_kg_pieces_litres;
    cookedAt: Time;
    ngoId?: Principal;
    notes: string;
    quantity: bigint;
    hostId: Principal;
    vegNonVeg: Variant_veg_nonVeg;
    foodName: string;
    pickupLocation: string;
}
export interface Notification {
    id: bigint;
    userId: Principal;
    createdAt: Time;
    isRead: boolean;
    message: string;
}
export interface Delivery {
    id: bigint;
    status: DeliveryStatus;
    listingId: bigint;
    createdAt: Time;
    updatedAt: Time;
    volunteerId: Principal;
    ngoId: Principal;
    proofImage?: ExternalBlob;
}
export interface PlatformStats {
    totalVolunteersActive: bigint;
    totalNgosServed: bigint;
    totalFoodSaved: bigint;
    totalDeliveriesCompleted: bigint;
}
export interface FoodRequest {
    id: bigint;
    status: Variant_cancelled_fulfilled_open;
    urgency: Variant_low_high_critical_medium;
    createdAt: Time;
    unit: Variant_kg_pieces_litres;
    numberOfPeople: bigint;
    ngoId: Principal;
    notes: string;
    quantityNeeded: bigint;
    foodType: string;
}
export interface UserProfile {
    id: Principal;
    isApproved: boolean;
    name: string;
    joinedAt: Time;
    role: Role;
    organization?: string;
    phone: string;
    location: string;
}
export enum DeliveryStatus {
    onTheWay = "onTheWay",
    pickedUp = "pickedUp",
    delivered = "delivered",
    accepted = "accepted"
}
export enum Role {
    ngo = "ngo",
    admin = "admin",
    host = "host",
    volunteer = "volunteer"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_cancelled_fulfilled_open {
    cancelled = "cancelled",
    fulfilled = "fulfilled",
    open = "open"
}
export enum Variant_expired_completed_claimed_available {
    expired = "expired",
    completed = "completed",
    claimed = "claimed",
    available = "available"
}
export enum Variant_kg_pieces_litres {
    kg = "kg",
    pieces = "pieces",
    litres = "litres"
}
export enum Variant_low_high_critical_medium {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export enum Variant_veg_nonVeg {
    veg = "veg",
    nonVeg = "nonVeg"
}
export interface backendInterface {
    acceptDelivery(listingId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelFoodRequest(requestId: bigint): Promise<void>;
    cancelListing(listingId: bigint): Promise<void>;
    claimListing(listingId: bigint): Promise<void>;
    createFoodRequest(request: FoodRequest): Promise<void>;
    createListing(listing: FoodListing): Promise<void>;
    createNotification(userId: Principal, message: string): Promise<void>;
    createOrUpdateProfile(profile: UserProfile): Promise<void>;
    getAllDeliveries(): Promise<Array<Delivery>>;
    getAllListings(): Promise<Array<FoodListing>>;
    getAllRequests(): Promise<Array<FoodRequest>>;
    getAvailableListings(limit: bigint, offset: bigint): Promise<Array<FoodListing>>;
    getAvailableTasks(): Promise<Array<FoodListing>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyDeliveries(): Promise<Array<Delivery>>;
    getMyListings(): Promise<Array<FoodListing>>;
    getMyNotifications(): Promise<Array<Notification>>;
    getMyRequests(): Promise<Array<FoodRequest>>;
    getOpenRequests(): Promise<Array<FoodRequest>>;
    getPlatformStats(): Promise<PlatformStats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllUsers(): Promise<Array<UserProfile>>;
    markNotificationAsRead(notificationId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleNgoApproval(ngoId: Principal): Promise<void>;
    updateDeliveryStatus(deliveryId: bigint, status: DeliveryStatus, proofImage: ExternalBlob | null): Promise<void>;
    updateListingStatus(listingId: bigint, status: Variant_expired_completed_claimed_available): Promise<void>;
}
