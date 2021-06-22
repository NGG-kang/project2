import React from "react";
import PostNewLayout from "components/PostNewLayout";
import PostEditForm from "components/PostEditForm";

function UserProfile({ match }) {
  return (
    <PostNewLayout>
      <PostEditForm match={match} />
    </PostNewLayout>
  );
}
export default UserProfile;
