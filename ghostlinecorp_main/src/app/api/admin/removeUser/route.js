// src/app/api/admin/removeUser/route.js
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Remove user from Supabase Auth system
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      return new Response(
        JSON.stringify({ error: deleteAuthError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Optionally, also delete user profile from 'profiles' table
    const { error: deleteProfileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (deleteProfileError) {
      return new Response(
        JSON.stringify({ error: deleteProfileError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}