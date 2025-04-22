import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role key for admin ops!
);

export async function GET(request) {
  try {
    // Read auth token from Authorization header: "Bearer <token>"
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const accessToken = authHeader.split(" ")[1];

    // Get user by validating access token
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !data.user) {
      return new Response(JSON.stringify({ error: error?.message || "User not found" }), { status: 401 });
    }

    // Optionally fetch profile from profiles table for richer data
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("display_name, role, avatar")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      // Just log or ignore if profile missing
      console.error("Profile fetch error:", profileError.message);
    }

    return new Response(JSON.stringify({ user: data.user, profile: profile || null }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}