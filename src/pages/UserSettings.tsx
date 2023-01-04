import { User } from "@supabase/supabase-js";
import React from "react";

export default function userSettings({ user }: { user: User }) {
	return <div>These are user settings</div>;
}
