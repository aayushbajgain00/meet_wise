
import React, { useState } from "react";
import "./settings.css";
import MeetingSetting from "./MeetingSetting";
import ProfileSetting from "./ProfileSetting";
import AccountSettings from "./AccountSettings";

export default function Settings({ page }) {
	// page prop should be 'meeting', 'profile', or 'account' based on the route
	if (page === "meeting") return <MeetingSetting />;
	if (page === "profile") return <ProfileSetting />;
	if (page === "account") return <AccountSettings />;
	return null;
}
