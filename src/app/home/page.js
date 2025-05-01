"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  // 1. You track 'user' state but never update it. That's a problem.
  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLoggedUser() {
      try {
        // 2. Obtain the session properly and await the Promise.
        const sessionResponse = await supabase.auth.getSession();
        const accessToken = sessionResponse.data?.session.access_token;

        if (!accessToken) {
          // 3. No token means no user - set loading false and clear states
          setUser(null);          // <-- Add this to clear user state
          setProfile(null);
          setLoading(false);
          return;
        }

        // 4. Call your backend with this token in Authorization header
        const res = await fetch('/api/auth/getUser', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!res.ok) {
          setUser(null);          // <-- Add this too
          setProfile(null);
          setLoading(false);
          return;
        }

        const json = await res.json();

        // 5. IMPORTANT: You never update 'user' state anywhere
        // You need to setUser here from the returned data.
        // Assuming your API returns something like { user: ..., profile: ... }
        setUser(json.user || null);
        setProfile(json.profile || null);

      } catch (error) {
        console.error("Error fetching logged user:", error);

        // 6. On error, reset user and profile states
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchLoggedUser();
  }, []);

  // 7. Your loading UI - good
  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading...</p>;
  }

  // 8. Check for user - good, now will work since 'user' is set correctly above
  if (!user) {
    return <p style={{ padding: "2rem" }}>You are not logged in.</p>;
  }

  // 9. Display variables - changed to use profile.display_name (or user.email as fallback)
  //    Also fix displayName typo from sample
  const displayName = profile?.display_name || user.email || "No name";
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
        font-family: 'geist', latin;
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
    
    .admin-button {
        margin-top: 1.5rem;
        padding: 0.5rem;
        background: #5a6d8;
        border: none;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transitiion: background 0.3 ease;
    }
    .admin-button:hover {
      background: #434190
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
        {role === "admin" && (   // Example: Show button only for admins
          <button
            className="admin-button"
            onClick={() => router.push("/admin")}
          >
            Go to Admin Page
          </button>
    )}
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