
import React, { useState } from "react";
import "./settings.css";
import ProfileSetting from "./ProfileSetting";
import AccountSetting from "./AccountSetting";

export default function Settings({ page }) {
// ...existing code...
	if (page === "profile") return <ProfileSetting />;
	if (page === "account") return <AccountSetting />;
	return null;
}
