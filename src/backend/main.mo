import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Migration "migration";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Roles and Profiles
  public type Role = {
    #host;
    #ngo;
    #volunteer;
    #admin;
  };

  public type UserProfile = {
    id : Principal;
    role : Role;
    name : Text;
    organization : ?Text;
    phone : Text;
    location : Text;
    isApproved : Bool;
    joinedAt : Time.Time;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Required profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, { profile with id = caller });
  };

  // Create or update profile (legacy function)
  public shared ({ caller }) func createOrUpdateProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    userProfiles.add(caller, { profile with id = caller });
  };

  // Admin: List all users
  public query ({ caller }) func listAllUsers() : async [UserProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can list all users");
    };
    userProfiles.values().toArray();
  };

  // Admin: Toggle NGO approval
  public shared ({ caller }) func toggleNgoApproval(ngoId : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve NGOs");
    };
    switch (userProfiles.get(ngoId)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        if (profile.role != #ngo) {
          Runtime.trap("User is not an NGO");
        };
        userProfiles.add(ngoId, { profile with isApproved = not profile.isApproved });
      };
    };
  };

  // Helper function to check if user is approved NGO
  private func isApprovedNgo(userId : Principal) : Bool {
    switch (userProfiles.get(userId)) {
      case (null) { false };
      case (?profile) {
        profile.role == #ngo and profile.isApproved;
      };
    };
  };

  // Helper function to check if user is host
  private func isHost(userId : Principal) : Bool {
    switch (userProfiles.get(userId)) {
      case (null) { false };
      case (?profile) { profile.role == #host };
    };
  };

  // Helper function to check if user is volunteer
  private func isVolunteer(userId : Principal) : Bool {
    switch (userProfiles.get(userId)) {
      case (null) { false };
      case (?profile) { profile.role == #volunteer };
    };
  };

  // Food Listings (posted by hosts)
  public type FoodListing = {
    id : Nat;
    hostId : Principal;
    foodName : Text;
    quantity : Nat;
    unit : { #kg; #litres; #pieces };
    vegNonVeg : { #veg; #nonVeg };
    cookedAt : Time.Time;
    expiresAt : Time.Time;
    pickupLocation : Text;
    notes : Text;
    status : { #available; #claimed; #completed; #expired };
    createdAt : Time.Time;
    ngoId : ?Principal;
  };

  let foodListings = Map.empty<Nat, FoodListing>();
  var nextListingId = 1;

  // Host: Create listing
  public shared ({ caller }) func createListing(listing : FoodListing) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create listings");
    };
    if (not isHost(caller)) {
      Runtime.trap("Unauthorized: Only hosts can create food listings");
    };
    let newId = nextListingId;
    nextListingId += 1;
    foodListings.add(newId, { listing with id = newId; hostId = caller });
  };

  // Anyone: Browse available listings
  public query ({ caller }) func getAvailableListings(limit : Nat, offset : Nat) : async [FoodListing] {
    let availableListings = foodListings.values().toArray().filter(
      func(l) { l.status == #available }
    );
    let endIndex = Nat.min(offset + limit, availableListings.size());
    if (offset >= availableListings.size()) {
      return [];
    };
    Array.tabulate<FoodListing>(
      endIndex - offset,
      func(i) { availableListings[offset + i] }
    );
  };

  // Host: View own listings
  public query ({ caller }) func getMyListings() : async [FoodListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view listings");
    };
    if (not isHost(caller)) {
      Runtime.trap("Unauthorized: Only hosts can view their listings");
    };
    foodListings.values().toArray().filter<FoodListing>(
      func(l) { Principal.equal(l.hostId, caller) }
    );
  };

  // NGO: Claim a listing
  public shared ({ caller }) func claimListing(listingId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim listings");
    };
    if (not isApprovedNgo(caller)) {
      Runtime.trap("Unauthorized: Only approved NGOs can claim listings");
    };
    switch (foodListings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        if (listing.status != #available) {
          Runtime.trap("Listing is not available");
        };
        foodListings.add(
          listingId,
          {
            listing with
            status = #claimed;
            ngoId = ?caller;
          },
        );
      };
    };
  };

  // Host: Cancel listing
  public shared ({ caller }) func cancelListing(listingId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel listings");
    };
    switch (foodListings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        if (not Principal.equal(listing.hostId, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the host or admin can cancel this listing");
        };
        if (listing.status != #available) {
          Runtime.trap("Can only cancel available listings");
        };
        foodListings.add(
          listingId,
          { listing with status = #expired },
        );
      };
    };
  };

  // Admin: View all listings
  public query ({ caller }) func getAllListings() : async [FoodListing] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all listings");
    };
    foodListings.values().toArray();
  };

  // Admin: Change listing status
  public shared ({ caller }) func updateListingStatus(listingId : Nat, status : { #available; #claimed; #completed; #expired }) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update listing status");
    };
    switch (foodListings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        foodListings.add(listingId, { listing with status = status });
      };
    };
  };

  // Food Requests (posted by NGOs)
  public type FoodRequest = {
    id : Nat;
    ngoId : Principal;
    foodType : Text;
    quantityNeeded : Nat;
    unit : { #kg; #litres; #pieces };
    urgency : { #low; #medium; #high; #critical };
    numberOfPeople : Nat;
    notes : Text;
    status : { #open; #fulfilled; #cancelled };
    createdAt : Time.Time;
  };

  let foodRequests = Map.empty<Nat, FoodRequest>();
  var nextRequestId = 1;

  // NGO: Create food request
  public shared ({ caller }) func createFoodRequest(request : FoodRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create food requests");
    };
    if (not isApprovedNgo(caller)) {
      Runtime.trap("Unauthorized: Only approved NGOs can create food requests");
    };
    let newId = nextRequestId;
    nextRequestId += 1;
    foodRequests.add(newId, { request with id = newId; ngoId = caller });
  };

  // Anyone: Browse open requests
  public query ({ caller }) func getOpenRequests() : async [FoodRequest] {
    foodRequests.values().toArray().filter<FoodRequest>(
      func(r) { r.status == #open }
    );
  };

  // NGO: View own requests
  public query ({ caller }) func getMyRequests() : async [FoodRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view requests");
    };
    if (not isApprovedNgo(caller)) {
      Runtime.trap("Unauthorized: Only approved NGOs can view their requests");
    };
    foodRequests.values().toArray().filter<FoodRequest>(
      func(r) { Principal.equal(r.ngoId, caller) }
    );
  };

  // NGO: Cancel request
  public shared ({ caller }) func cancelFoodRequest(requestId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel requests");
    };
    switch (foodRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (not Principal.equal(request.ngoId, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the NGO or admin can cancel this request");
        };
        if (request.status != #open) {
          Runtime.trap("Can only cancel open requests");
        };
        foodRequests.add(requestId, { request with status = #cancelled });
      };
    };
  };

  // Admin: View all requests
  public query ({ caller }) func getAllRequests() : async [FoodRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all requests");
    };
    foodRequests.values().toArray();
  };

  // Deliveries
  public type DeliveryStatus = {
    #accepted;
    #pickedUp;
    #onTheWay;
    #delivered;
  };

  public type Delivery = {
    id : Nat;
    listingId : Nat;
    ngoId : Principal;
    volunteerId : Principal;
    status : DeliveryStatus;
    proofImage : ?Storage.ExternalBlob;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  let deliveries = Map.empty<Nat, Delivery>();
  var nextDeliveryId = 1;

  // Volunteer: View available tasks (claimed listings without delivery)
  public query ({ caller }) func getAvailableTasks() : async [FoodListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    if (not isVolunteer(caller)) {
      Runtime.trap("Unauthorized: Only volunteers can view available tasks");
    };
    let claimedListings = foodListings.values().toArray().filter(
      func(l) { l.status == #claimed }
    );
    let allDeliveries = deliveries.values().toArray();
    claimedListings.filter(
      func(listing) {
        not allDeliveries.any(
          func(d) {
            d.listingId == listing.id;
          }
        );
      }
    );
  };

  // Volunteer: Accept delivery task
  public shared ({ caller }) func acceptDelivery(listingId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can accept deliveries");
    };
    if (not isVolunteer(caller)) {
      Runtime.trap("Unauthorized: Only volunteers can accept deliveries");
    };
    switch (foodListings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        if (listing.status != #claimed) {
          Runtime.trap("Listing must be claimed to create delivery");
        };
        switch (listing.ngoId) {
          case (null) { Runtime.trap("Listing has no NGO assigned") };
          case (?ngoId) {
            // Check if delivery already exists
            let existingDelivery = deliveries.values().toArray().any(
              func(d) { d.listingId == listingId }
            );
            if (existingDelivery) {
              Runtime.trap("Delivery already exists for this listing");
            };
            let newId = nextDeliveryId;
            nextDeliveryId += 1;
            let delivery : Delivery = {
              id = newId;
              listingId = listingId;
              ngoId = ngoId;
              volunteerId = caller;
              status = #accepted;
              proofImage = null;
              createdAt = Time.now();
              updatedAt = Time.now();
            };
            deliveries.add(newId, delivery);
          };
        };
      };
    };
  };

  // Volunteer: Update delivery status
  public shared ({ caller }) func updateDeliveryStatus(deliveryId : Nat, status : DeliveryStatus, proofImage : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update deliveries");
    };
    switch (deliveries.get(deliveryId)) {
      case (null) { Runtime.trap("Delivery not found") };
      case (?delivery) {
        if (not Principal.equal(delivery.volunteerId, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the assigned volunteer or admin can update this delivery");
        };
        deliveries.add(
          deliveryId,
          {
            delivery with
            status = status;
            proofImage = proofImage;
            updatedAt = Time.now();
          },
        );
        // Update listing status if delivered
        if (status == #delivered) {
          switch (foodListings.get(delivery.listingId)) {
            case (null) {};
            case (?listing) {
              foodListings.add(delivery.listingId, { listing with status = #completed });
            };
          };
        };
      };
    };
  };

  // All parties: View delivery status for related records
  public query ({ caller }) func getMyDeliveries() : async [Delivery] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view deliveries");
    };
    deliveries.values().toArray().filter<Delivery>(
      func(d) {
        Principal.equal(d.volunteerId, caller) or
        Principal.equal(d.ngoId, caller) or
        (switch (foodListings.get(d.listingId)) {
          case (null) { false };
          case (?listing) { Principal.equal(listing.hostId, caller) };
        })
      }
    );
  };

  // Admin: View all deliveries
  public query ({ caller }) func getAllDeliveries() : async [Delivery] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all deliveries");
    };
    deliveries.values().toArray();
  };

  // Notifications
  public type Notification = {
    id : Nat;
    userId : Principal;
    message : Text;
    isRead : Bool;
    createdAt : Time.Time;
  };

  let notifications = Map.empty<Nat, Notification>();
  var nextNotificationId = 1;

  // Internal: Create notification (can be called by system)
  public shared ({ caller }) func createNotification(userId : Principal, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create notifications");
    };
    let newId = nextNotificationId;
    nextNotificationId += 1;
    let notification : Notification = {
      id = newId;
      userId;
      message;
      isRead = false;
      createdAt = Time.now();
    };
    notifications.add(newId, notification);
  };

  // Get own notifications
  public query ({ caller }) func getMyNotifications() : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };
    notifications.values().toArray().filter<Notification>(
      func(n) { Principal.equal(n.userId, caller) }
    );
  };

  // Mark notification as read
  public shared ({ caller }) func markNotificationAsRead(notificationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };
    switch (notifications.get(notificationId)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?notification) {
        if (not Principal.equal(notification.userId, caller)) {
          Runtime.trap("Unauthorized: Can only mark your own notifications as read");
        };
        notifications.add(
          notificationId,
          { notification with isRead = true },
        );
      };
    };
  };

  // Platform Stats (public for landing page)
  public type PlatformStats = {
    totalFoodSaved : Nat;
    totalNgosServed : Nat;
    totalVolunteersActive : Nat;
    totalDeliveriesCompleted : Nat;
  };

  public query func getPlatformStats() : async PlatformStats {
    let completedDeliveries = deliveries.values().toArray().filter(
      func(d) { d.status == #delivered }
    );

    // Calculate total food saved from completed deliveries
    var totalFoodSaved = 0;
    for (delivery in completedDeliveries.vals()) {
      switch (foodListings.get(delivery.listingId)) {
        case (null) {};
        case (?listing) {
          totalFoodSaved += listing.quantity;
        };
      };
    };

    // Count distinct NGOs from completed deliveries
    let ngoSet = Map.empty<Principal, Bool>();
    for (delivery in completedDeliveries.vals()) {
      ngoSet.add(delivery.ngoId, true);
    };
    let totalNgosServed = ngoSet.size();

    // Count active volunteers (those with at least one delivery)
    let volunteerSet = Map.empty<Principal, Bool>();
    for (delivery in deliveries.values()) {
      volunteerSet.add(delivery.volunteerId, true);
    };
    let totalVolunteersActive = volunteerSet.size();

    {
      totalFoodSaved = totalFoodSaved;
      totalNgosServed = totalNgosServed;
      totalVolunteersActive = totalVolunteersActive;
      totalDeliveriesCompleted = completedDeliveries.size();
    };
  };
};
