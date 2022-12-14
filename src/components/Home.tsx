import type { User } from "@supabase/supabase-js";
import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/api";
import RecoverPassword from "./RecoverPassword";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Goals from "../pages/Goals";
import SingleGoal from "../pages/SingleGoal";
import Todos from "../pages/Todos";

const Home = ({ user }: { user: User }) => {
	const [recoveryToken, setRecoveryToken] = useState<string | null>(null);

	interface IResults {
		access_token: string;
		refresh_token: string;
		expires_in: string;
		token_type: string;
		type: string;
	}

	useEffect(() => {
		/* Recovery url is of the form
		 * <SITE_URL>#access_token=x&refresh_token=y&expires_in=z&token_type=bearer&type=recovery
		 * Read more on https://supabase.com/docs/reference/javascript/reset-password-email#notes
		 */
		let url = window.location.hash;
		let query = url.slice(1);
		let result: IResults = {
			access_token: "",
			refresh_token: "",
			expires_in: "",
			token_type: "",
			type: "",
		};

		query.split("&").forEach((part) => {
			const item = part.split("=");
			result[item[0] as keyof IResults] = decodeURIComponent(item[1]);
		});

		if (result.type === "recovery") {
			setRecoveryToken(result.access_token);
		}
	}, []);

	const handleLogout = async () => {
		supabase.auth.signOut().catch(console.error);
	};

	return recoveryToken ? (
		<RecoverPassword token={recoveryToken} setRecoveryToken={setRecoveryToken} />
	) : (
		<div className="mainContainer">
			<header className="">
				<h1>Goal Tracking</h1>
				<button
					onClick={handleLogout}
					className={
						"flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
					}
				>
					Logout
				</button>
			</header>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Goals userId={user.id} />} />
					<Route path="/goal/:id" element={<SingleGoal userId={user.id} />} />
					<Route path="/todos" element={<Todos user={user} />} />
				</Routes>
			</BrowserRouter>

			{/* <GoalsPage user={user}></GoalsPage> */}
		</div>
	);
};

export default Home;
