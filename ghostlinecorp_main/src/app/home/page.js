"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function fetchUserProfile() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (user) {
        // Fetch profile from 'profiles' table
        const { data, error } = await supabase
        .from("profiles")
        .select("full_name, id, role")
        .eq("id", user.id)
        .single();

        if (!error) {
            setProfile(data);
        }
    }

    setLoading(false);
    }

    fetchUserProfile();
}, []);

if (loading) {
    return <p style={{ padding: "2rem" }}>Loading...</p>;
}

if (!user) {
    return <p style={{ padding: "2rem" }}>You are not logged in.</p>;
}

const displayName = profile?.email || user.email || "No name";
const role = profile?.role || "user";

return (
    <>
    <style jsx>{`
        .container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding: 1rem 2rem;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
        background: #f3f4f6;
        }

        .profile {
        flex: 0 0 20%;
        display: flex;
        align-items: center;
        border-bottom: 2px solid #ddd;
        padding-bottom: 1rem;
        gap: 1rem;
        }

        .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #667eea;
        box-shadow: 0 0 6px rgba(102, 126, 234, 0.6);
        }

        .user-info {
        flex-grow: 1;
        }

        .display-name {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0;
        color: #333;
        }

        .role {
        margin: 0;
        font-weight: 600;
        color: #5a67d8;
        }

        .grid {
        flex: 1 1 auto;
        margin-top: 1.5rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-content: flex-start;
        overflow-y: auto;
        }

        .box {
        background: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        flex: 1 1 calc(25% - 1rem);
        min-width: 200px;
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        color: #667eea;
        font-size: 1.2rem;
        user-select: none;
        cursor: pointer;
        transition: box-shadow 0.3s ease;
    }

    .box:hover {
        box-shadow: 0 8px 16px rgba(102, 126, 234, 0.8);
    }

    @media (max-width: 768px) {
        .box {
        flex: 1 1 calc(50% - 1rem);
        }
    }

    @media (max-width: 480px) {
        .box {
        flex: 1 1 100%;
        }
    }
    `}</style>

    <div className="container">
    <section className="profile">
        <div className="user-info">
        <p className="display-name">{displayName}</p>
        <p className="role">{role}</p>
        </div>
    </section>

    <section className="grid">
        {[...Array(8)].map((_, i) => (
        <div key={i} className="box">{`Box ${i + 1}`}</div>
        ))}
    </section>
    </div>
</>
);
}