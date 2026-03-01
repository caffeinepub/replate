import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type Project = {
    title : Text;
    description : Text;
    url : Text;
  };

  type Portfolio = {
    name : Text;
    bio : Text;
    skills : [Text];
    projects : [Project];
    contactEmail : Text;
  };

  type OldActor = {
    portfolio : Portfolio;
  };

  public func run(old : OldActor) : {} {
    {};
  };
};
