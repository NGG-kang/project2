import React from "react";
import PostNewLayout from "components/PostNewLayout";
import UserProfileView from "components/UserProfileView";

function UserProfile(upload) {
  return (
    <PostNewLayout>
      <UserProfileView upload={upload} />
    </PostNewLayout>
  );
}
export default UserProfile;
