// sync Clerk user data with the database

import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { env } from "~/env";
import { createUser, deleteUser, updateUser } from "~/lib/sync_users";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload: unknown = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const eventType = evt.type;

  // user creation event
  if (eventType === "user.created") {
    const {
      id,
      primary_email_address_id,
      email_addresses,
      first_name: firstName,
      last_name: lastName,
    } = evt.data;
    const email = email_addresses.find(
      (email) => email.id === primary_email_address_id,
    )?.email_address;
    if (email === undefined) {
      return new Response("Could not find email", {
        status: 400,
      });
    }
    if (firstName === null || lastName === null) {
      return new Response("First name or last name is null", {
        status: 400,
      });
    }
    try {
      await createUser({ id, email, firstName, lastName });
    } catch (err) {
      console.error("Error creating user:", err);
      return new Response("Error occured creating user", {
        status: 400,
      });
    }
  }

  // user deletion event
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id === undefined) {
      return new Response("Could not find user id in request", {
        status: 400,
      });
    }
    try {
      await deleteUser({ id });
    } catch (err) {
      console.error("Error deleting user:", err);
      return new Response("Error occured deleting user", {
        status: 400,
      });
    }
  }

  // user updated event
  if (eventType === "user.updated") {
    const {
      id,
      primary_email_address_id,
      email_addresses,
      first_name: firstName,
      last_name: lastName,
    } = evt.data;
    const email = email_addresses.find(
      (email) => email.id === primary_email_address_id,
    )?.email_address;
    if (email === undefined) {
      return new Response("Could not find email", {
        status: 400,
      });
    }
    if (firstName === null || lastName === null) {
      return new Response("First name or last name is null", {
        status: 400,
      });
    }
    try {
      await updateUser({ id, email, firstName, lastName });
    } catch (err) {
      console.error("Error updating user:", err);
      return new Response("Error occured updating user", {
        status: 400,
      });
    }
  }

  return new Response("", { status: 200 });
}
